package database

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"gopkg.in/pg.v5"
	"gopkg.in/pg.v5/orm"
)

// Student structure to store student information.
type Student struct {
	Roll       string    `sql:",pk" json:"i"`
	Username   string    `json:"u"`
	Name       string    `json:"n"`
	Program    string    `json:"p"`
	Dept       string    `json:"d"`
	Hall       string    `json:"h"`
	Room       string    `json:"r"`
	BloodGroup string    `json:"b"`
	Gender     string    `json:"g"`
	Hometown   string    `json:"a"`
	UpdatedAt  time.Time `json:"-"`
}

func (s Student) String() string {
	return fmt.Sprintf("Student<%s %s %s>", s.Roll, s.Name, s.Dept)
}

// BeforeInsert hook for Student.
func (s *Student) BeforeInsert(db orm.DB) error {
	s.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate hook of Student.
func (s *Student) BeforeUpdate(db orm.DB) error {
	s.UpdatedAt = time.Now()
	return nil
}

// Equal checks if two Students are effectively the same.
func (s *Student) Equal(s2 *Student) bool {
	b1, err := json.Marshal(*s)
	if err != nil {
		return false
	}
	b2, err := json.Marshal(*s2)
	if err != nil {
		return false
	}
	if !bytes.Equal(b1, b2) {
		return false
	}
	return true
}

// CreateStudentSchema creates schema for the student model.
func CreateStudentSchema(db *pg.DB) error {
	model := &(Student{})
	err := db.CreateTable(model, &orm.CreateTableOptions{})
	// Error for already existing schema which is not something we care about as the schema
	// is mostly constant
	var validError = regexp.MustCompile(`^.*ERROR #42P07.*$`)
	if validError.MatchString(err.Error()) {
		return nil
	}
	return err
}

func insertToDatabase(value *Student, db *pg.DB, wg *sync.WaitGroup) {
	defer wg.Done()

	// TODO:
	// The code below is not safe in the database sense.
	// If the record is updated while I'm doing these checks then it might not be correct.
	// In the current implementation, I can gaurantee that only 1 process is going to be accessing
	// the records of a particular student(for writing) and so the following steps should be safe
	// A better thing to do could be to use a better ORM than the one I have used offering a better
	// BeforeInsert Hook which can check if value has changed before inserting using the
	// POSTGres Upsert method

	readStud := &Student{
		Roll: value.Roll,
	}

	err := db.Select(&readStud)

	if err != nil {
		if err.Error() == "pg: no rows in result set" {
			err = db.Insert(value)
			if err != nil {
				log.Fatalln("Error in create: ", err)
			}
		} else {
			log.Fatalln("Error in reading from database: ", err)
		}
	} else {
		if !readStud.Equal(value) {
			err = db.Update(value)
			if err != nil {
				log.Fatalln("Error in update: ", err)
			}
		}
	}

}

// FetchStudent fetches student info from server using Roll Number Provided and stores the particular student in db.
func FetchStudent(roll string, db *pg.DB, wg *sync.WaitGroup) {
	defer wg.Done()
	url := fmt.Sprintf("http://oa.cc.iitk.ac.in:8181/Oa/Jsp/OAServices/IITk_SrchRes.jsp?typ=stud&numtxt=%s&sbm=", roll)
	doc, err := goquery.NewDocument(url)
	if err != nil {
		log.Printf("Error in fetchStudent readDoc: %s\n", err.Error())
		return
	}
	studentInfo := doc.Find(".TableContent p")
	student := Student{}
	student.Roll = roll
	studentInfo.Each(func(i int, s *goquery.Selection) {
		body := s.Text()
		field := strings.Split(strings.TrimSpace(body), ":")
		key := strings.TrimSpace(field[0])
		value := strings.TrimSpace(field[1])
		switch key {
		case "Name":
			student.Name = strings.Title(strings.ToLower(value))
		case "Program":
			student.Program = value
		case "Department":
			student.Dept = strings.Title(strings.ToLower(value))
		case "Hostel Info":
			if len(strings.Split(value, ",")) > 1 {
				student.Hall = strings.Split(value, ",")[0]
				student.Room = strings.Split(value, ",")[1]
			}
		case "E-Mail":
			if len(strings.Split(value, "@")) > 1 {
				student.Username = strings.Split(value, "@")[0]
			}
		case "Blood Group":
			student.BloodGroup = value
		case "Gender":
			if len(strings.Split(value, "\t")) > 1 {
				student.Gender = strings.TrimSpace((strings.Split(value, "\t")[0]))
			}
		default:
			fmt.Printf("%s %s\n", key, value)
		}
	})
	student.Hometown = getAddress(doc)
	wg.Add(1)
	go insertToDatabase(&student, db, wg)
}

func getAddress(doc *goquery.Document) string {
	body, err := doc.Html()
	if err != nil {
		log.Printf("Error in getAddress: %s\n", err.Error())
		return ""
	}
	if len(strings.Split(body, "Permanent Address :")) < 2 {
		return ""
	}
	address := strings.Split(strings.Split(body, "Permanent Address :")[1], ",")
	length := len(address)
	if len(address) > 2 {
		address = address[length-3 : length-1]
		return fmt.Sprintf("%s, %s", address[0], address[1])
	}
	return ""
}
