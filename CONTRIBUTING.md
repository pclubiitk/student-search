# Scraping data
* Create database:
  ```
  $ cd scrape
  $ sqlite3 ../database/students.db < schema.sql
  ```

* Install dependencies (preferably in a virtual environment - see next section):
  ```
  $ pip install -r requirements.txt
  ```

* Run scraping script:
  ```
  $ ./scrape.py
  ```

# Contributing to the Backend

* Setup Python
* Setup a virtual Environment using `virtualenv`:
  ```
  $ virtualenv /some/path/student-search
  ```
* Activate venv:
  ```
  $ source /some/path/student-search/bin/activate
  ```
* Install dependencies:
  ```
  $ pip install -r requirements.txt
  ```
* Hack on this!! (Its recommended to have scraped some data before this step)
  ```
  $ cd backend/
  $ FLASK_APP=server.py flask run
  ```

# Contributing to the frontend

* Install Angular CLI
  ```
  $ sudo npm install -g @angular/cli
  ```
* Clone this repo
* Goto the cloned folder's frontend folder
* Test out the frontend
  ```
  $ ng serve
  ```
  The frontend will be available at `localhost:4200`
* Make changes and test using `ng serve`
* Run `ng lint` before pushing
