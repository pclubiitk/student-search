import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { SearchHelper } from './search.helper';
import { SearchService } from './search.service';
import { Student } from './student.model';

@Component({
  selector: 'ssearch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading = true;
  students: Array<Student> = [];
  latestTerm: string = '';
  result: Array<Student> = [];

  deps: Array<string> = [];
  progs: Array<string> = [];
  bloodgrps: Array<string> = [];
  halls: Array<string> = [];
  genders: Array<string> = [];
  years: Array<string> = [];

  currentYear = 'Any';
  currentGender = 'Any';
  currentHall = 'Any';
  currentProg = 'Any';
  currentDep = 'Any';
  currentGrp = 'Any';
  currentAdd = '';

  private searchTerms = new Subject<string>();
  private addTerms = new Subject<string>();

  constructor(private search: SearchService) {}

  searchTerm(term: string): void {
    this.searchTerms.next(term);
  }
  addTerm(term: string): void {
    this.addTerms.next(term);
  }

  onlyUnique<T>(value: T, index: number, self: Array<T>): boolean {
    return self.indexOf(value) === index;
  }

  ngOnInit(): void {

    this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .subscribe(term => {
        if (term && term.length > 3) {
          this.latestTerm = term;
          this.update();
        } else {
          this.result = [];
        }
      });

    this.addTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(term => {
        console.log(term);
        this.currentAdd = term;
        this.update();
      });

    this.search.getInformation().then((res) => {

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

    });

  }

  update(): void {
    if (this.latestTerm !== '') {
      this.result = this.search.getResults(this.students, this.latestTerm, this.currentYear, this.currentGender,
                                           this.currentHall, this.currentProg, this.currentDep, this.currentGrp,
                                           this.currentAdd);
    } else {
      this.result = [];
    }
  }

}
