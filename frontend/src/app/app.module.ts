import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { MasonryModule } from 'angular2-masonry';

import { AppComponent } from './app.component';
import { SearchService } from './search.service';
import { StudentComponent } from './student.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MasonryModule,
    MaterialModule
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
