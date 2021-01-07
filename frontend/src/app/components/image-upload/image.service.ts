import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class ImageService {
  constructor(private http: HttpClient) {}

  checkIITK(){
    const check='/check/'
    let res=false;
    var x=new XMLHttpRequest();
    x.timeout=15000;
    x.open('GET','https://oa.cc.iitk.ac.in');
    x.onreadystatechange=function(){
        if(this.readyState==4){
            if(this.status==200){
                console.log('url exists');
            } else {
                console.log('url does not exist');
            }
        }
    }
    x.send();

    return res;
  }

  postFile(fileToUpload: File, radio) {
    const endpoint = '/api/image-upload';
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    formData.append('type', radio===1?'Person':'Landmark');
    console.log(formData.get('type'));
    this.http.post(endpoint, formData).subscribe(res=>{
      console.log(res);
    });
  }
}
