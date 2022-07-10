import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermisoI, UsuarioI } from './asignar-permisos.interfaces';
import { AsignarPermisosDialog } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AsignarPermisosServices {
  constructor(private _dialog: MatDialog) {}

  public asignarPermisos(users: UsuarioI[]) {
    const dialog = this._dialog.open(AsignarPermisosDialog, {
      height: '295px',
      width: '280px',
      data: users,
    });
    return dialog.afterClosed();
  }

  get permisos(): PermisoI[] {
    return [
      { tipo: 'modulo', codigo: '0900', nombre: 'Seguridad' },
      { tipo: 'permiso', codigo: '0901', nombre: 'Asignar Permisos' },
      { tipo: 'modulo', codigo: '0200', nombre: 'Balances de enfermería' },
      { tipo: 'permiso', codigo: '0201', nombre: 'Sabanas UCI' },
      { tipo: 'modulo', codigo: '0100', nombre: 'Hospitalización' },
      { tipo: 'permiso', codigo: '0101', nombre: 'Censo de pacientes' },
      { tipo: 'permiso', codigo: '0102', nombre: 'Jornada de dietas' },
      { tipo: 'permiso', codigo: '0103', nombre: 'Registro jornada de dietas' },
      { tipo: 'permiso', codigo: '0104', nombre: 'Censo de camas' },
      { tipo: 'modulo', codigo: '0300', nombre: 'Historia clínica' },
      { tipo: 'permiso', codigo: '0301', nombre: 'Desconfirmar epicrisis' },
      { tipo: 'permiso', codigo: '0302', nombre: 'Interconsultas pendientes' },
      { tipo: 'modulo', codigo: '0400', nombre: 'Facturación' },
      { tipo: 'permiso', codigo: '0401', nombre: 'Conceptos de admisión' },
      { tipo: 'modulo', codigo: '0500', nombre: 'Informes gerenciales' },
      { tipo: 'permiso', codigo: '0501', nombre: 'Facturación por periodo' },
      { tipo: 'permiso', codigo: '0502', nombre: 'Estadistico PFGP' },
      { tipo: 'permiso', codigo: '0503', nombre: 'Estadistico de radicación' },
      { tipo: 'modulo', codigo: '0600', nombre: 'Radicación' },
      { tipo: 'permiso', codigo: '0601', nombre: 'Reporte de sabanas' },
      { tipo: 'modulo', codigo: '0700', nombre: 'Cartera' },
      { tipo: 'permiso', codigo: '0701', nombre: 'Gestión de cartera' },
      { tipo: 'permiso', codigo: '0702', nombre: 'Conciliación de cartera' },
    ];
  }
}
