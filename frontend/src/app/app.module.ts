import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SearchMaterialModule } from './material.module';
import {MatRadioModule} from '@angular/material/radio'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatDialogModule} from '@angular/material/dialog'
import {MatIconModule} from '@angular/material/icon'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { DetailComponent } from './components/detail';
import { HelpDialogComponent } from './components/help-dialog';
import { MailDialogComponent } from './components/mail-dialog';
import { SearchComponent } from './components/search';
import { SearchService } from './services/search.service';
import { StudentComponent } from './components/student';
import {ImageDialogComponent, ImageDialogButtonComponent} from './components/image-upload/image-dialog.component'
import { ImageService } from './components/image-upload/image.service';
import {MultipleTabs, MultipleTabsDialog} from './components/multiple-tabs/multiple-tabs.component'

@NgModule({
  declarations: [
    DetailComponent,
    HelpDialogComponent,
    MailDialogComponent,
    SearchComponent,
    StudentComponent,
    ImageDialogComponent,
    ImageDialogButtonComponent,
    MultipleTabs,
    MultipleTabsDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    SearchMaterialModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule
  ],
  providers: [SearchService, ImageService],
  bootstrap: [SearchComponent]
})
export class AppModule { }
