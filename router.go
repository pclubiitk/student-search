package main

import (
	"github.com/pclubiitk/student-search/database"

	"gopkg.in/kataras/iris.v5"
	"gopkg.in/pg.v5"
)

// StudentSearchRoute is a route for the search.
func StudentSearchRoute(db *pg.DB) {

	api := iris.Party("/api")

	api.Get("/students", func(ctx *iris.Context) {
		var students []database.Student
		err := db.Model(&students).Select()
		if err != nil {
			panic(err)
		}
		err = ctx.JSON(iris.StatusOK, students)
		if err != nil {
			panic(err)
		}
	})

}
