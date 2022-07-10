import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'eda-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaModal {
  constructor(
    private _dialogRef: MatDialogRef<EdaModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this._dialogRef.close(false);
  }

  onConfirm(): void {
    this._dialogRef.close(true);
  }

  onClose(): void {
    this._dialogRef.close(true);
  }
}
