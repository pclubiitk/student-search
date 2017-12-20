import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatInput, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HelpDialogComponent } from '../help-dialog';
import { MailDialogComponent } from '../mail-dialog';
import { SearchHelper } from '../../helpers/search.helper';
import { SearchService } from '../../services/search.service';
import { Student } from '../../models/student.model';

const FACTOR = 50;

@Component({
  selector: 'search-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  students: Array<Student> = [];
  loading = true;
  @ViewChild('searchBox', { read: MatInput }) searchBox: MatInput;

  private maxIndex: number;
  allResults: Array<Student> = [];
  result: Array<Student> = [];

  deps: Array<string> = [];
  progs: Array<string> = [];
  bloodgrps: Array<string> = [];
  halls: Array<string> = [];
  genders: Array<string> = [];
  years: Array<string> = [];

  private latestTerm = '';
  currentYear = [];
  currentGender = 'Any';
  currentHall = [];
  currentProg = [];
  currentDep = [];
  currentGrp = [];
  currentAdd = '';

  private searchTerms = new Subject<string>();
  private addTerms = new Subject<string>();

  constructor(private dialog: MatDialog,
              private matSnackBar: MatSnackBar,
              private search: SearchService) {}

  searchTerm(t: string): void {
    const term = t.trim();
    this.searchTerms.next(term);
  }
  addTerm(t: string): void {
    const term = t.trim();
    this.addTerms.next(term);
  }

  onlyUnique<T>(value: T, index: number, self: Array<T>): boolean {
    return self.indexOf(value) === index;
  }

  ngOnInit(): void {

    this.registerServiceWorker();

    this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .subscribe(term => {
        this.latestTerm = term;
        this.update();
      });

    this.addTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(term => {
        this.currentAdd = term;
        this.update();
      });

    this.search.getInformation().subscribe((res) => {
      this.students = res;

      const deps = res.map((val) => SearchHelper.ParseBranch(val.d));
      this.deps = deps.filter(this.onlyUnique).sort();

      const prog = res.map((val) => val.p);
      this.progs = prog.filter(this.onlyUnique).sort();

      const bloodgrp = res.map((val) => val.b);
      this.bloodgrps = bloodgrp.filter(this.onlyUnique).filter((elem) => elem !== 'Not Available').sort();

      const hall = res.map((val) => val.h);
      this.halls = hall.filter(this.onlyUnique).filter((elem) => elem !== '' ).sort();

      const gender = res.map((val) => val.g);
      this.genders = gender.filter(this.onlyUnique).filter((e) => e !== 'null').sort();

      const year = res.map((val) => SearchHelper.ParseYear(val.i));
      this.years = year.filter(this.onlyUnique).sort();

      this.loading = false;
      this.searchBox.focus();

    });

  }

  isAny(arr: Array<String>) {
    return (arr.length === 0 ||
            (arr.length === 1 && arr[0] === 'Any'));
  }

  update(): void {
    if (this.latestTerm.length > 2 || this.currentYear.length !== 0 || this.currentGender !== 'Any' ||
        this.currentHall.length !== 0 || this.currentProg.length !== 0 || this.currentDep.length !== 0 ||
        this.currentGrp.length !== 0 || this.currentAdd !== '') {
      this.result = [];
      this.allResults = this.search.getResults(this.students, this.latestTerm, this.currentYear, this.currentGender,
                                               this.currentHall, this.currentProg, this.currentDep, this.currentGrp,
                                               this.currentAdd);
      this.result = this.result.concat(this.allResults.slice(0, FACTOR));
      this.maxIndex = 50;
    } else {
      this.allResults = [];
      this.result = [];
    }
  }

  addMoreElements() {
    if (this.maxIndex < this.allResults.length) {
      this.result = this.result.concat(this.allResults.slice(this.maxIndex, this.maxIndex + FACTOR));
      this.maxIndex += FACTOR;
    }
  }

  showMailDialog() {
    this.dialog.open(MailDialogComponent, {
      data: {
        mails: this.allResults.map((val) => val.u + '@iitk.ac.in')
      },
      panelClass: 'centered-dialog'
    });
  }

  showHelpDialog() {
    this.dialog.open(HelpDialogComponent, {
      panelClass: 'centered-dialog'
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').then((reg) => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;

          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                const snackBarRef = this.matSnackBar.open('Updated content is available', 'Reload');
                snackBarRef.onAction().subscribe(() => {
                  location.reload(true);
                });
              } else {
                this.matSnackBar.open('Content is now available offline!', '', {
                  duration: 1000
                });
              }
              break;

            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
            }
          };
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
    }
  }

}
