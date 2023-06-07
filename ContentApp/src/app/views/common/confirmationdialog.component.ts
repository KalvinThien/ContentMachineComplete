import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <p-button
      (click)="showDialog()"
      icon="pi pi-external-link"
      label="Show"
    ></p-button>
    <p-dialog header="Header" [(visible)]="visible" [style]="{ width: '50vw' }">
      <ng-template pTemplate="header">
        <span class="text-xl font-bold">Header Content</span>
      </ng-template>
      <p>
        It looks like you have not finished entering your informatino. If you
        leave now you'll use your progress.
      </p>
      <ng-template pTemplate="footer">
        <p-button
          icon="pi pi-check"
          (click)="visible = false"
          label="Ok"
          styleClass="p-button-text"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ConfirmationDialogComponent {
  visible: boolean = false;

  constructor(
    // public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  showDialog() {
    this.visible = true;
  }
}
