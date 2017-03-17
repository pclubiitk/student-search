import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SearchHelper } from '../helpers/search.helper';
import { Student } from '../models/student.model';

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

      if (!(year === null || year === 'Any')) {
        if (SearchHelper.ParseYear(elem.i) !== year) {
          return false;
        }
      }

      if (!(gender === null || gender === 'Any')) {
        if (elem.g !== gender) {
          return false;
        }
      }

      if (!(hall === null || hall === 'Any')) {
        if (elem.h !== hall) {
          return false;
        }
      }

      if (!(prog === null || prog === 'Any')) {
        if (elem.p !== prog) {
          return false;
        }
      }

      if (!(dep === null || dep === 'Any')) {
        if (SearchHelper.ParseBranch(elem.d) !== dep) {
          return false;
        }
      }

      if (!(grp === null || grp === 'Any')) {
        if (elem.b !== grp) {
          return false;
        }
      }

      if (!(hometown === null || hometown === '')) {
        const addregex = new RegExp(hometown, 'i');
        if (!addregex.test(elem.a)) {
          return false;
        }
      }

      if (!(term === null || term === '')) {
        const termregex = new RegExp(escape(term).replace(/\s+/g, ' '), 'i');
        return (termregex.test(elem.i) || termregex.test(elem.u) || termregex.test(elem.n.replace(/\s+/g, ' ')));
      }

      return true;

    };

    return students.filter(filter);

  }

}
