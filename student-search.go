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

type serverConfig struct {
	pghost   string
	pgport   string
	username string
	dbname   string
	httpport int
}

func main() {

	iris.Config.Gzip = true
	iris.Config.LoggerPreffix = "[student-search] "

	iris.Use(logger.New())
	iris.Use(recovery.New())
	iris.Use(cors.Default())

	// log http errors
	iris.OnError(iris.StatusNotFound, myCorsMiddleware)

	c, err := getConfig()
	if err != nil {
		iris.Logger.Printf("Error getting server config: %v\n", err)
	}

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", c.pghost, c.pgport),
		Database: c.dbname,
		User:     c.username,
	})

	err = database.CreateStudentSchema(db)
	if err != nil {
		iris.Logger.Printf("Error in createSchema: %s\n", err.Error())
	}

	StudentSearchRoute(db)

	iris.Listen(fmt.Sprintf(":%d", c.httpport))
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

func getConfig() (*serverConfig, error) {
	cfg, err := config.ParseYamlFile("./config.yml")
	if err != nil {
		return nil, fmt.Errorf("error reading config: %v", err)
	}
	cfg.EnvPrefix("STUDENT_SEARCH")
	var c serverConfig

	if c.pghost, err = cfg.String("pg.host"); err != nil {
		return nil, fmt.Errorf("error parsing postgres host: %v", err)
	}
	if c.pgport, err = cfg.String("pg.port"); err != nil {
		return nil, fmt.Errorf("error parsing postgres port: %v", err)
	}
	if c.username, err = cfg.String("pg.username"); err != nil {
		return nil, fmt.Errorf("error parsing postgres username: %v", err)
	}
	if c.dbname, err = cfg.String("pg.database"); err != nil {
		return nil, fmt.Errorf("error parsing postgres database name: %v", err)
	}
	if c.httpport, err = cfg.Int("http.port"); err != nil {
		return nil, fmt.Errorf("error parsing http port: %v", err)
	}
	return &c, nil
}
