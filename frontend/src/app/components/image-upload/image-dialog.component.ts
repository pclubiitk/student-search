import {Component, Inject} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
      console.log('The dialog was closed');
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
  preview=this.defaultURI
  toUpload=null
  tried=false
  inIITK=false

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public serv: ImageService) {
  }
  check(val){
    this.inIITK=val;
    console.log(val)
  }
  onBrowse(e){
    let f=<File>e.target.files[0];
    if(f.type.split('/')[0]!='image'){
      console.log(f.type);
      //TODO snackbar
      return
    }
    if(f.size>10000000){
      console.log(f.size);
      console.log('File too big');
      return;
    }
    this.toUpload=f;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.preview = event.target.result;
      // console.log(this.preview)
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsDataURL(this.toUpload);

    console.log(this.toUpload);
  }

  onSubmit(form: NgForm){
    console.log(form.form.value);
    if(form.form.valid&&this.inIITK){
      this.serv.postFile(this.toUpload, parseInt(form.form.value.radio));
    }
    else{
      this.tried=true
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
