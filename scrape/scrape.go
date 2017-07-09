package main

import (
	"flag"
	"fmt"
	"log"
	"runtime"
	"strings"
	"sync"

	"github.com/pclubiitk/student-search/database"

	"github.com/PuerkitoBio/goquery"
	"github.com/olebedev/config"
	"gopkg.in/pg.v5"
)

type scraperConfig struct {
	batchSize int
	total     int
	host      string
	port      string
	username  string
	dbname    string
}

func main() {
	runtime.GOMAXPROCS(8)
	log.SetPrefix("[student-scrape] ")

	c, err := parseScraperConfig()
	if err != nil {
		log.Fatalf("Error getting scraper config: %v", err)
	}

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", c.host, c.port),
		Database: c.dbname,
		User:     c.username,
	})

	err = database.CreateStudentSchema(db)
	if err != nil {
		log.Printf("Error in createSchema: %s\n", err.Error())
	}

	// If I just want to update a single roll number's database entry
	singleRun := flag.Bool("single", false, "Get Single Roll Number")
	flag.Parse()
	if *singleRun {
		var rollnum string
		fmt.Printf("Enter Roll Num: ")
		_, err = fmt.Scanf("%s", &rollnum)
		if err != nil {
			panic(err)
		}

		var wg sync.WaitGroup
		wg.Add(1)
		go database.FetchStudent(rollnum, db, &wg)
		wg.Wait()
		log.Println("Done")
	} else {
		log.Println("Starting")
		// Process in sizes of batchSize and then wait for completion
		for j := 0; j < c.total+1; j += c.batchSize {
			var wg sync.WaitGroup
			for i := j; i < j+c.batchSize; i += 12 {
				// Add 1 to waitgroup for each go routine launched
				wg.Add(1)
				go fetchNums(i, db, &wg)
			}
			// Wait for all goroutines in this batch to finish
			wg.Wait()
			log.Printf("Done %d\n", j+c.batchSize)
		}
		log.Println("Done ", c.total)
	}

	// Cleanup
	err = db.Close()
	if err != nil {
		log.Fatalln("Error closing db: ", err)
	}
}

func fetchNums(count int, db *pg.DB, wg *sync.WaitGroup) {
	defer wg.Done()
	url := fmt.Sprintf("http://oa.cc.iitk.ac.in:8181/Oa/Jsp/OAServices/IITk_SrchStudRoll.jsp?recpos=%d&selstudrol=&selstuddep=&selstudnam=", count)
	doc, err := goquery.NewDocument(url)
	if err != nil {
		log.Printf("Error in fetchNums: %s\n", err.Error())
		return
	}
	doc.Find(".TableText a").Each(func(i int, s *goquery.Selection) {
		roll := strings.TrimSpace(s.Text())
		wg.Add(1)
		go database.FetchStudent(roll, db, wg)
	})
}

func parseScraperConfig() (*scraperConfig, error) {
	cfg, err := config.ParseYamlFile("./scraper-config.yml")
	var c scraperConfig
	if err != nil {
		return nil, fmt.Errorf("error reading config: %v", err)
	}
	cfg.EnvPrefix("STUDENT_SCRAPE")

	if c.batchSize, err = cfg.Int("scrape.batch"); err != nil {
		return nil, fmt.Errorf("error parsing batch size: %v", err)
	}
	// Multiple of 12 to prevent repetitions
	if c.batchSize%12 != 0 {
		return nil, fmt.Errorf("batch size should be a multiple of 12 to prevent DB errors, got: %d", c.batchSize)
	}
	if c.total, err = cfg.Int("scrape.total"); err != nil {
		return nil, fmt.Errorf("error parsing total: %v", err)
	}
	if c.host, err = cfg.String("pg.host"); err != nil {
		return nil, fmt.Errorf("error parsing host: %v", err)
	}
	if c.port, err = cfg.String("pg.port"); err != nil {
		return nil, fmt.Errorf("error parsing port: %v", err)
	}
	if c.username, err = cfg.String("pg.username"); err != nil {
		return nil, fmt.Errorf("error parsing username: %v", err)
	}
	if c.dbname, err = cfg.String("pg.database"); err != nil {
		return nil, fmt.Errorf("error parsing database: %v", err)
	}
	return &c, nil
}
