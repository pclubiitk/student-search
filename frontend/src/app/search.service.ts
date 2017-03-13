import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SearchHelper } from './search.helper';
import { Student } from './student.model';

@Injectable()
export class SearchService {

  constructor(private http: Http) {}

  getInformation(): Promise<Array<Student>> {
    return this.http.get('https://search.pclub.in/api/students')
      .map((res: Response) => {
        function compare(a: Student, b: Student) {
          if (a.i < b.i) {
            return -1;
          }
          if (a.i > b.i) {
            return 1;
          }
          return 0;
        }
        const students = res.json() as Array<Student>;
        return students.sort(compare);
      }).toPromise();
  }

  getResults(students: Array<Student>, term: string, year?: string, gender?: string,
            hall?: string, prog?: string, dep?: string,
             grp?: string, hometown ?: string): Array<Student> {

    const escape = (s: string) => {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    const filter = (elem: Student): Boolean => {
      let yearregex, genderregex, hallregex, progregex, depregex, grpregex, addregex;

      if (year === null || year === 'Any') {
        yearregex = new RegExp('.*', 'i');
      } else {
        yearregex = new RegExp(year, 'i');
      }

      if (gender === null || gender === 'Any') {
        genderregex = new RegExp('.*', 'i');
      } else {
        genderregex = new RegExp(gender, 'i');
      }

      if (hall === null || hall === 'Any') {
        hallregex = new RegExp('.*', 'i');
      } else {
        hallregex = new RegExp(hall, 'i');
      }

      if (prog === null || prog === 'Any') {
        progregex = new RegExp('.*', 'i');
      } else {
        progregex = new RegExp(prog, 'i');
      }

      if (dep === null || dep === 'Any') {
        depregex = new RegExp('.*', 'i');
      } else {
        depregex = new RegExp(dep, 'i');
      }

      if (grp === null || grp === 'Any') {
        grpregex = new RegExp('.*', 'i');
      } else {
        grpregex = new RegExp(grp, 'i');
      }

      if (hometown === null || hometown === '') {
        addregex = new RegExp('.*', 'i');
      } else {
        addregex = new RegExp(hometown, 'i');
      }

      if (!yearregex.test(SearchHelper.ParseYear(elem.i))) {
        return false;
      }
      if (!genderregex.test(elem.g)) {
        return false;
      }
      if (!hallregex.test(elem.h)) {
        return false;
      }
      if (!progregex.test(elem.p)) {
        return false;
      }
      if (!depregex.test(SearchHelper.ParseBranch(elem.d))) {
        return false;
      }
      if (!grpregex.test(elem.b)) {
        return false;
      }
      if (!addregex.test(elem.a)) {
        return false;
      }

      const termregex = new RegExp(escape(term).replace(/\s+/g, ' '), 'i');
      return (termregex.test(elem.i) || termregex.test(elem.u) || termregex.test(elem.n.replace(/\s+/g, ' ')));

    };

    return students.filter(filter);

  }

}
