import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { ClipboardModule } from 'ngx-clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MasonryModule } from 'angular2-masonry';

import { DetailComponent } from './components/detail';
import { HelpDialogComponent } from './components/help-dialog';
import { MailDialogComponent } from './components/mail-dialog';
import { SearchComponent } from './components/search';
import { SearchService } from './services/search.service';
import { StudentComponent } from './components/student';

@NgModule({
  declarations: [
    DetailComponent,
    HelpDialogComponent,
    MailDialogComponent,
    SearchComponent,
    StudentComponent
  ],
  entryComponents: [
    DetailComponent,
    HelpDialogComponent,
    MailDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    FlexLayoutModule,
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
