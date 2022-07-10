import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuggestionI } from 'src/app/application/interfaces/suggestion.interface';
import { ApiService } from 'src/app/application/services/api.service';
import { ModalService } from 'src/app/application/services/modal.service';

@Component({
  selector: 'conceptos-admision-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptosAdmisionDialog {
  public conceptFact = new FormControl(12, [Validators.required]);
  public conceptoSuggestions: SuggestionI[] = [
    { value: 12, option: 'MEDICAMENTO POS' },
    { value: 13, option: 'MEDICAMENTO NO POS' },
  ];
  constructor(
    public dialogRef: MatDialogRef<ConceptosAdmisionDialog>,
    private _modal: ModalService,
    private _api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public setConceptFact(): void {
    if (!this.conceptFact.value) {
      this._modal.alert('Usted no ha seleccionado ningún concepto de facturación');
    } else {
      this._modal
        .confirm(
          `¿deseas cambiar el concepto de facturación a los ${this.data.length} productos seleccionados?`,
          '¿seguro(a)?'
        )
        .subscribe(response => {
          if (response) {
            const toSend: any = [];
            this.data.map((r: any) => {
              toSend.push({ oid: r, tipo: this.conceptFact.value });
            });
            console.log(toSend);
            const url = `concepto-admision`;
            this._api.post(toSend, url).subscribe(res => {
              if (res.success) {
                this.dialogRef.close(true);
              } else {
                this.dialogRef.close('Ocurrió un error al intentar actualizar');
              }
            });
          }
        });
    }
  }
}
