package main

import (
	"net/http"

	"github.com/pclubiitk/student-search/database"

	"github.com/go-pg/pg"
	"github.com/labstack/echo"
)

// StudentSearchRoute is a route for the search.
func StudentSearchRoute(e *echo.Echo, db *pg.DB) {

	// A group is a set of endpoints behind the same path
	api := e.Group("/api")

	api.GET("/students", func(ctx echo.Context) error {
		var students []database.Student
		err := db.Model(&students).Select()
		if err != nil {
			return err
		}
		if students == nil {
			return ctx.NoContent(http.StatusNotFound)
		}
		return ctx.JSON(http.StatusOK, students)
	})

	api.GET("/student", func(ctx echo.Context) error {
		var students []database.Student
		if ctx.QueryParam("username") == "" {
			return ctx.NoContent(http.StatusBadRequest)
		}
		err := db.Model(&students).Where("username LIKE ?", ctx.QueryParam("username")).Select()
		if err != nil {
			return err
		}
		if len(students) < 1 {
			return ctx.NoContent(http.StatusNotFound)
		}
		return ctx.JSON(http.StatusOK, students[0])
	})

}
