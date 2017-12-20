import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'search-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.css']
})
export class MailDialogComponent {

  mails: Array<string>;

  constructor(public dialogRef: MatDialogRef<MailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public snackBar: MatSnackBar) {
    this.mails = this.data.mails;
  }

  successSnackBar() {
    this.snackBar.open('Email Addresses Copied', 'Dismiss', {
      duration: 3000
    });
  }

}
