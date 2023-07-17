import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(content: any, confirmFn?: () => void) {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: 500,
      data: {
        content: content,
        confirmFn: confirmFn
      }
    });
  }
}
