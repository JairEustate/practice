import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/application/services/api.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { PermisoI, UsuarioI } from '../asignar-permisos.interfaces';
import { AsignarPermisosServices } from '../asignar-permisos.services';

@Component({
  selector: 'conceptos-admision-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsignarPermisosDialog implements OnInit {
  permisos!: PermisoI[];
  permisosSeleccionados: string[] = [];

  constructor(
    private _asignarPermisosServices: AsignarPermisosServices,
    private _dialogRef: MatDialogRef<AsignarPermisosDialog>,
    private _cd: ChangeDetectorRef,
    private _modal: ModalService,
    private _api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public ngOnInit(): void {
    this.permisos = this._asignarPermisosServices.permisos;
    if (this.data.length === 1) {
      this._api.get(`permissions/${this.data[0].id}`).subscribe(res => {
        if (res.success) {
          res.data.map((r: string) => {
            this.permisosSeleccionados.push(r);
          });
          this._cd.markForCheck();
        }
      });
    }
  }

  public addPermisosToUsuario(checked: boolean, codigo: string): void {
    if (checked) {
      this.permisosSeleccionados.push(codigo);
    } else {
      this.permisosSeleccionados = this.permisosSeleccionados.filter(
        (r: string) => r !== codigo
      );
    }
  }

  public onSetPermisos(): void {
    let confirmMsg = `¿deseas asignar estos permisos al usuario seleccionado?`;
    if (this.data.length > 1) {
      confirmMsg = `¿deseas asignar estos permisos a los ${this.data.length} usuarios seleccionados?`;
    }
    this._modal.confirm(confirmMsg, '¿seguro(a)?').subscribe(value => {
      if (value) {
        const users: any = [];
        this.data.map((r: UsuarioI) => {
          users.push(r.id);
        });
        const body = { users, modulos: this.permisosSeleccionados };
        this._api.post(body, 'permissions').subscribe(res => {
          if (res.success) {
            this._dialogRef.close(true);
          } else {
            this._dialogRef.close(false);
          }
        });
      }
    });
  }
}
