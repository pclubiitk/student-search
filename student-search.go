package main

import (
	"fmt"

	"github.com/pclubiitk/student-search/database"

	"github.com/go-pg/pg"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/olebedev/config"
)

type serverConfig struct {
	pghost   string
	pgport   string
	username string
	dbname   string
	httpport int
}

func main() {

	e := echo.New()
	loggerConfig := middleware.LoggerConfig{
		Format: "[student-search] ${remote_ip} - - [${time_rfc3339}] \"${method} ${uri}\" ${status} ${bytes_out}\n",
	}
	e.Use(middleware.Gzip(), middleware.Recover(), middleware.LoggerWithConfig(loggerConfig))

	c, err := getConfig()

	if err != nil {
		e.Logger.Fatalf("Error in getting config: %v", err)
	}

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", c.pghost, c.pgport),
		Database: c.dbname,
		User:     c.username,
	})

	if err = database.CreateStudentSchema(db); err != nil {
		e.Logger.Fatalf("Error in createSchema: %v\n", err)
	}

	StudentSearchRoute(e, db)
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", c.httpport)))

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
