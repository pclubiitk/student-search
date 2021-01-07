import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

/**
 * @title Dialog elements
 */
@Component({
  selector: 'multiple-tabs',
  template: '',
})
export class MultipleTabs {
  constructor(public dialog: MatDialog) {
    this.multipleTabs();
  }

  multipleTabs(){
    const channel = new BroadcastChannel('tab');

    channel.postMessage('another-tab');
    // note that listener is added after posting the message

    channel.addEventListener('message', (msg) => {
      if (msg.data === 'another-tab') {
        this.openDialog()
      }
    });
  }
  openDialog() {
    const ref=this.dialog.open(MultipleTabsDialog, {});
    ref.afterClosed().subscribe(()=>window.location.reload())
  }
}


@Component({
  selector: 'multiple-tabs-dialog',
  templateUrl: 'multiple-tabs-dialog.html',
  styleUrls: ['multiple-tabs-dialog.css']
})
export class MultipleTabsDialog {}
