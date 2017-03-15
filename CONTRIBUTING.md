# Contributing to the Backend

* Setup Go
  Install `go` from your software repos and install `glide` using:
  ```
  $ curl https://glide.sh/get | sh
  ```
* Clone this repo to your GOPATH
  Set up your `$GOPATH` correctly.
  ```
  $ mkdir -p $GOPATH/src/github.com/pclubiitk
  $ git clone https://github.com/pclubiitk/student-search $GOPATH/src/github.com/pclubiitk/student-search
  ```
* Install Dependencies
  ```
  $ cd $GOPATH/src/github.com/pclubiitk/student-search && glide install
  ```
* Hack on this!!

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
