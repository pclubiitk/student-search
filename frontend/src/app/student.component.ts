import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SearchHelper } from './search.helper';
import { Student } from './student.model';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {

  @Input()
  student: Student;

  parseYear = SearchHelper.ParseYear;

  constructor(private sanitizer: DomSanitizer) {}

  url = () => {
    let generic = this.student.g === 'F' ? 'https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/yp/r/yDnr5YfbJCH.gif' : 'https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v2/yL/r/HsTZSDw4avx.gif';
    return this.sanitizer.bypassSecurityTrustStyle(`url("http://home.iitk.ac.in/~${this.student.u}/dp"), url("http://oa.cc.iitk.ac.in:8181/Oa/Jsp/Photo/${this.student.i}_0.jpg"), url("${generic}")`);
  }

}
