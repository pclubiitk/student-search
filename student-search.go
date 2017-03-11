package main

import (
	"fmt"

	"github.com/pclubiitk/student-search/database"

	"github.com/iris-contrib/middleware/cors"
	"github.com/iris-contrib/middleware/logger"
	"github.com/iris-contrib/middleware/recovery"
	"github.com/olebedev/config"
	"gopkg.in/kataras/iris.v5"
	"gopkg.in/pg.v5"
)

func main() {

	iris.Config.Gzip = true
	iris.Config.LoggerPreffix = "[student-search] "

	iris.Use(logger.New())
	iris.Use(recovery.New())
	iris.Use(cors.Default())

	// log http errors
	iris.OnError(iris.StatusNotFound, myCorsMiddleware)

	pghost, pgport, username, dbname, port := getConfig()

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", pghost, pgport),
		Database: dbname,
		User:     username,
	})

	err := database.CreateStudentSchema(db)
	if err != nil {
		iris.Logger.Printf("Error in createSchema: %s\n", err.Error())
	}

	StudentSearchRoute(db)

	iris.Listen(fmt.Sprintf(":%d", port))
}

// myCorsMiddleware for handling OPTIONS requests
func myCorsMiddleware(ctx *iris.Context) {

	if ctx.MethodString() == "OPTIONS" {
		ctx.SetHeader("Access-Control-Allow-Origin", "*")
		ctx.SetHeader("Access-Control-Allow-Headers", "content-type")
		err := ctx.Text(200, "")
		if err != nil {
			panic(err)
		}
	} else {
		errorLogger := logger.New()
		errorLogger.Serve(ctx)
	}

}

func getConfig() (string, string, string, string, int) {
	cfg, err := config.ParseYamlFile("./config.yml")
	if err != nil {
		iris.Logger.Fatalln("Unable to get config. Aborting")
	}
	cfg.EnvPrefix("STUDENT_SEARCH")

	pghost, err := cfg.String("pg.host")
	check(err, "Postgres Hostname")
	pgport, err := cfg.String("pg.port")
	check(err, "Postgres Port")
	username, err := cfg.String("pg.username")
	check(err, "Postgres Username")
	dbname, err := cfg.String("pg.database")
	check(err, "Postgres DBName")
	port, err := cfg.Int("http.port")
	check(err, "Http Listen Port")
	return pghost, pgport, username, dbname, port
}

func check(err error, item string) {
	if err != nil {
		iris.Logger.Fatalf("Unable to get %s from config. Error: ", err.Error())
	}
}
