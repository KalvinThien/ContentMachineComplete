import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Are you sure?</h2>
    <mat-dialog-content>
      <p>It looks like you have not finished entering your informatino.  If you leave now you'll use your progress.</p>
    </mat-dialog-content>
    <mat-dialog-actions style="justify-content: flex-end;">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true" style="color: red;">Confirm</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }
}
