import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CensoPacienteI } from 'src/app/domain/modules/hospitalizacion/censo-pacientes/censo-pacientes.interfaces';
import { CensoPacientesDetalles } from 'src/app/domain/modules/hospitalizacion/censo-pacientes/censo-pacientes.component';

@Injectable({
  providedIn: 'root',
})
export class CensoPacientesService {
  constructor(private _dialog: MatDialog) {}

  /**
   * muestra los detalles del paciente seleccionado en
   * hospitalizacion/censo-pacientes.
   * @param paciente
   */
  detallesPaciente(paciente: CensoPacienteI) {
    this._dialog.open(CensoPacientesDetalles, {
      height: '90vh',
      maxHeight: '650px',
      width: '80vw',
      maxWidth: '750px',
      data: paciente,
    });
  }
}
