import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { MasonryModule } from 'angular2-masonry';

import { DetailComponent } from './components/detail';
import { SearchComponent } from './components/search';
import { SearchService } from './services/search.service';
import { StudentComponent } from './components/student';

@NgModule({
  declarations: [
    DetailComponent,
    SearchComponent,
    StudentComponent
  ],
  entryComponents: [
    DetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MasonryModule,
    MaterialModule
  ],
  providers: [SearchService],
  bootstrap: [SearchComponent]
})
export class AppModule { }
