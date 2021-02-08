import {Component, Inject} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import { DetailComponent } from '../detail';
import { Student } from '../../models/student.model';
import { ImageService } from './image.service';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'image-dialog-button',
  templateUrl: './image-dialog-button.component.html',
})
export class ImageDialogButtonComponent {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls:['./image-dialog.css'],
  providers: [ImageService]
})
export class ImageDialogComponent {

  defaultURI='https://www.jamiemaison.com/creating-a-simple-text-editor/placeholder.png'
  success=false
  preview=this.defaultURI
  toUpload=null
  tried=false
  inIITK=false

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public serv: ImageService) {
  }
  check(val){
    this.inIITK=val;
    console.log(val);
  }
  onBrowse(e){
    let f=<File>e.target.files[0];
    if(f.type.split('/')[0]!='image'){
      // console.log(f.type);
      this.snackBar.open("Non-image files are not supported", "CLOSE", {duration: 2500});
      return
    }
    if(f.size>10000000){
      console.log(f.size);
      this.snackBar.open("Image size should be < 10MB", "CLOSE", {duration: 2500});
      return;
    }
    this.toUpload=f;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.preview = event.target.result;
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.toUpload);

  }

  async onSubmit(form: NgForm){
    // console.log(form.form.value);
    if(form.form.valid&&this.inIITK){
      this.success=true;
      let res=await this.serv.postFile(this.toUpload, parseInt(form.form.value.radio)).catch((err)=>this.success=false);
      if(!this.success){
        this.snackBar.open("Something went wrong", "CLOSE", {duration: 2500});
        return;
      }
      this.dialog.open(DetailComponent, {
        data: {
          student: res
        },
        panelClass: 'centered-dialog',
        width: '360px'
      });
    }
    else{
      this.tried=true
      if(!this.inIITK){
      this.snackBar.open("Connect to IITK server", "CLOSE", {duration: 2500});
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
