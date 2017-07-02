import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';

import { DetailComponent } from '../detail';
import { SearchHelper } from '../../helpers/search.helper';
import { Student } from '../../models/student.model';

@Component({
  selector: 'search-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {

  @Input()
  student: Student;

  parseYear = SearchHelper.ParseYear;

  constructor(private sanitizer: DomSanitizer,
              private dialog: MdDialog) {}

  get dept() {
    return SearchHelper.ParseBranch(this.student.d);
  }

  url = () => {
    return this.sanitizer.bypassSecurityTrustStyle(SearchHelper.ImageURL(this.student.g, this.student.i, this.student.u));
  }

  openDialog() {
    this.dialog.open(DetailComponent, {
      data: {
        student: this.student
      }
    });
  }

}
