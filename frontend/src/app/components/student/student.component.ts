import { Component, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';

import { DetailComponent } from '../detail';
import { SearchHelper } from '../../helpers/search.helper';
import { Student } from '../../models/student.model';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';

@Component({
  selector: 'search-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  animations: [ fadeInOutAnimation ]
})
export class StudentComponent {

  @HostBinding('@fadeInOutAnimation') fadeInOutAnimation = '';

  @Input()
  student: Student;

  parseYear = SearchHelper.ParseYear;

  constructor(private sanitizer: DomSanitizer,
              private dialog: MatDialog) {}

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
      },
      panelClass: 'centered-dialog',
      width: '360px'
    });
  }

}
