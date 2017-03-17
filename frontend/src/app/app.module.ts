import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { ClipboardModule } from 'ngx-clipboard';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MasonryModule } from 'angular2-masonry';

import { DetailComponent } from './components/detail';
import { MailDialogComponent } from './components/mail-dialog';
import { SearchComponent } from './components/search';
import { SearchService } from './services/search.service';
import { StudentComponent } from './components/student';

@NgModule({
  declarations: [
    DetailComponent,
    MailDialogComponent,
    SearchComponent,
    StudentComponent
  ],
  entryComponents: [
    DetailComponent,
    MailDialogComponent
  ],
  imports: [
    BrowserModule,
    ClipboardModule,
    FormsModule,
    HttpModule,
    InfiniteScrollModule,
    MasonryModule,
    MaterialModule
  ],
  providers: [SearchService],
  bootstrap: [SearchComponent]
})
export class AppModule { }
