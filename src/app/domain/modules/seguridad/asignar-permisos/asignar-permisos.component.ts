import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from 'src/app/application/services/store.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';
import { AsignarPermisosServices } from './asignar-permisos.services';
import { UsuarioI } from './asignar-permisos.interfaces';
import { SeguridadStore } from '../seguridad.store';

@Component({
  selector: 'app-asignar-permisos',
  templateUrl: './asignar-permisos.component.html',
  styleUrls: ['./asignar-permisos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsignarPermisos implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();

  public displayedColumns: any = ['select', 'rol', 'identification', 'user', 'permisos'];
  public columnNames: any = ['select', 'Rol', 'Doc. Identidad', 'Nombre', 'Permisos'];
  public hasSelectableRows: boolean = true;
  public loading: boolean = false;
  public selection: UsuarioI[] = [];
  public lastUpdated: string = '';

  public usuarios: number = 0;
  public usuariosFiltrados!: string;
  public usuariosSeleccionados: string = `0 Usuario(s) seleccionado(s)`;

  constructor(
    private _asignarPermisosServices: AsignarPermisosServices,
    private _seguridadStore: SeguridadStore,
    private _modal: ModalService,
    private _store: StoreService,
    private _toast: ToastService,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    this._seguridadStore.usuarios$.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (data.wasLoaded) {
        this._store.setDataSource(data.dataSource, data.lastUpdated, true);
        this.lastUpdated = data.lastUpdated.fromNow();
        this.usuarios = data.dataSource.length;
        this.usuariosFiltrados = `${data.dataSource.length} Usuario(s)`;
      } else {
        this.getUsuarios();
      }
    });
  }

  public getUsuarios(): void {
    this.loading = true;
    this._api.get('users').subscribe(res => {
      if (res.success) {
        this._seguridadStore.setUsuarios(res.data, true);
        this.loading = false;
      }
    });
  }

  public onSelectRows(rows: any): void {
    this.selection = rows;
    this.usuariosSeleccionados = `${rows.length} Usuario(s) seleccionado(s)`;
    if (this.selection.length === 0) {
      this.hasSelectableRows = true;
    } else {
      this.hasSelectableRows = false;
    }
  }

  public onSelectRow(row: any): void {
    this._asignarPermisosServices.asignarPermisos([row]).subscribe(value => {
      if (value) {
        this._toast.notification('Los permisos fueron asignados correctamente');
      }
      if (value === false) {
        this._toast.notification('Los permisos NO fueron asignados correctamente');
      }
    });
  }

  public setPermissionsToUsers(): void {
    if (this.selection.length <= 0) {
      this._modal.alert('Usted no ha seleccionado ningún usuario');
    } else {
      this._asignarPermisosServices.asignarPermisos(this.selection).subscribe(value => {
        if (value) {
          this._toast.notification('Los permisos fueron asignados correctamente');
        }
        if (value === false) {
          this._toast.notification('Los permisos NO fueron asignados correctamente');
        }
      });
    }
  }

  public onFiltering(event: any): void {
    this.usuariosFiltrados = `${event.length} Usuario(s)`;
    this.usuariosSeleccionados = `0 Usuario(s) seleccionado(s)`;
    this.hasSelectableRows = true;
  }

  public onResetFilter(): void {
    this.hasSelectableRows = true;
    this.usuariosFiltrados = `${this.usuarios} Usuario(s)`;
    this.usuariosSeleccionados = `0 Usuario(s) seleccionado(s)`;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
