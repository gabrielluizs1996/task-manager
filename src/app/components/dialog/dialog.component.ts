import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  content: any;
  confirmFn: () => void;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.content = data.content;
    this.confirmFn = data.confirmFn;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmDialog(): void {
    this.confirmFn();
  }
}
