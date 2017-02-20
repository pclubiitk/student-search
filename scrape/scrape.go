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

func main() {

	runtime.GOMAXPROCS(8)
	log.SetPrefix("[student-scrape] ")

	batchSize, total, host, port, username, dbname := getConfig()

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Database: dbname,
		User:     username,
	})

	err := database.CreateStudentSchema(db)
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
		for j := 0; j < total+1; j += batchSize {
			var wg sync.WaitGroup
			for i := j; i < j+batchSize; i += 12 {
				// Add 1 to waitgroup for each go routine launched
				wg.Add(1)
				go fetchNums(i, db, &wg)
			}
			// Wait for all goroutines in this batch to finish
			wg.Wait()
			log.Printf("Done %d\n", j+batchSize)
		}
		log.Println("Done ", total)
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

func getConfig() (int, int, string, string, string, string) {
	cfg, err := config.ParseYamlFile("./scraper-config.yml")
	if err != nil {
		log.Fatalln("Unable to get config. Aborting")
	}
	cfg.EnvPrefix("STUDENT_SCRAPE")

	batchSize, err := cfg.Int("scrape.batch") // Multiple of 12 to prevent repititions
	if err != nil {
		log.Fatalln("Unable to get batch size from config. Aborting")
	}
	if batchSize%12 != 0 {
		log.Fatalf("Batch size: %d must be a multiple of 12 to prevent db errors. Aborting", batchSize)
	}
	total, err := cfg.Int("scrape.total")
	if err != nil {
		log.Fatalln("Unable to get total from config. Aborting")
	}
	host, err := cfg.String("pg.host")
	if err != nil {
		log.Fatalln("Unable to get host from config. Aborting")
	}
	port, err := cfg.String("pg.port")
	if err != nil {
		log.Fatalln("Unable to get port from config. Aborting")
	}
	username, err := cfg.String("pg.username")
	if err != nil {
		log.Fatalln("Unable to get username from config. Aborting")
	}
	dbname, err := cfg.String("pg.database")
	if err != nil {
		log.Fatalln("Unable to get dbname from config. Aborting")
	}
	return batchSize, total, host, port, username, dbname
}
