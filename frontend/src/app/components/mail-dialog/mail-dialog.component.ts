import { Component, Inject, Input } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component({
  selector: 'search-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.css']
})
export class MailDialogComponent {

  mails: Array<string>;

  constructor(public dialogRef: MdDialogRef<MailDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              public snackBar: MdSnackBar) {
    this.mails = this.data.mails;
  }

  successSnackBar() {
    this.snackBar.open('Email Addresses Copied', 'Dismiss', {
      duration: 3000
    });
  }

}

