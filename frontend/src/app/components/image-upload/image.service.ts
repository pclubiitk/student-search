import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class ImageService {
  constructor(private http: HttpClient) {}

  postFile(fileToUpload: File, radio) {
    const endpoint = '/api/image-upload';
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    formData.append('type', radio===1?'Person':'Landmark');
    // console.log(formData.get('type'));
    this.http.post(endpoint, formData).subscribe(res=>{
      console.log(res);
    });
  }
}
