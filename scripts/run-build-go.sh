#!/bin/bash
set -ev

cd scrape && go build scrape.go
cd .. && go build student-search.go router.go
