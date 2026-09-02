import { Component, Inject, inject, Injectable, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-dialog',
  imports: [MatButtonModule],
  template: '',
  styleUrl: './dialog.css',
})
export class Dialog {
  readonly dialog = inject(MatDialog);

  openDialog({ title, message, confirmDialog }: DialogType) {
    const dialogRef = this.dialog.open(DialogElement, { data: { title, message, confirmDialog } });

    return dialogRef.afterClosed()
  }
}

@Component({
  selector: 'app-dialog-element',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: 'dialog.element.html',
  styles: '',
})
export class DialogElement {
  data = inject<{ title: string; message: string; confirmDialog?: boolean }>(MAT_DIALOG_DATA);
}
