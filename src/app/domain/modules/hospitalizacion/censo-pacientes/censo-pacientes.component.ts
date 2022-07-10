import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from 'src/app/application/services/store.service';
import { ApiService } from 'src/app/application/services/api.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { HospitalizacionStore } from '../hospitalizacion.store';
import { TableService } from 'src/app/application/services/table.service';

@Component({
  selector: 'app-censo-pacientes',
  templateUrl: './censo-pacientes.component.html',
  styleUrls: ['./censo-pacientes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CensoPacientes implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  //Variables de la tabla
  public displayedColumns: string[] = [
    'HCACODIGO',
    'GPANOMPAC',
    'GPAEDAPAC',
    'ESTANCIA',
    'GDENOMBRE',
  ];
  public columnNames: string[] = [
    'Cama',
    'Paciente',
    'Edad',
    'Estancia',
    'Contrato Area de Servicio',
  ];
  public loading: boolean = false;
  //otras variables
  public ALTA_CENTRO: string = 'ALTA COMPLEJIDAD DEL CARIBE';
  public MEDICOS_SA: string = 'CLINICA MEDICOS SA';
  public dataSourceLength: number = 0;
  public dataSourceContent: string = 'TODOS';
  public dataValues: any;
  public lastUpdated: any;

  constructor(
    private _hospitalizacionStore: HospitalizacionStore,
    private _tableService: TableService,
    private _matDialog: MatDialog,
    private _store: StoreService,
    private _toast: ToastService,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    this._hospitalizacionStore.censoPacientes$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (!data.wasLoaded) {
          this.getCensoPacientes();
        } else {
          this._store.setDataSource(data.dataSource);
          this.dataSourceLength = data.dataSource.length;
          this.dataSourceContent = 'TODOS';
          this.dataValues = data.dataSource;
          this.lastUpdated = data.lastUpdated.fromNow();
        }
      });
  }

  public getCensoPacientes(): void {
    this._setLoading();
    const url = `estancias`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this._hospitalizacionStore.setCensoPacientes(res.data, true);
        this._setLoading();
      } else {
        this._setLoading();
      }
    });
  }

  private _setLoading(): void {
    if (this.loading) {
      this.loading = false;
    } else {
      this.loading = true;
    }
  }

  public showEstanciasPaciente(row: any): void {
    if (row.CAMAS.length > 0) {
      this._tableService.simpleDialogTable(
        `Estancias de ${row.GPANOMPAC}`,
        `Estancias_${row.GPANOMPAC}`,
        ['Cama', 'DIAS', 'FechaIngreso', 'FechaSalida', 'Grupo', 'Ingreso'],
        ['Cama', 'Dias Estancia', 'Fecha Ingreso', 'Fecha Salida', 'Grupo', 'Ingreso'],
        row.CAMAS,
        [90, 40, 100, 100, 310, 60]
      );
    } else {
      this._toast.notification('Este paciente aun no tiene estancias');
    }
  }

  public showInformacionPaciente(row: any): void {
    this._matDialog.open(CensoPacientesDetalles, {
      height: '90vh',
      maxHeight: '650px',
      width: '80vw',
      maxWidth: '750px',
      data: row,
    });
  }

  public filtrarPorCentro(FILTRO: string): void {
    if (FILTRO !== 'ALL') {
      let newArray = this.dataValues.filter(
        (element: { ACANOMBRE: string }) => element.ACANOMBRE === FILTRO
      );
      this.dataSourceLength = newArray.length;
      this.dataSourceContent = `DE ${FILTRO}`;
      this._store.setDataSource(newArray);
    } else {
      this.dataSourceLength = this.dataValues.length;
      this.dataSourceContent = 'TODOS';
      this._store.setDataSource(this.dataValues);
    }
  }
  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
/* detalles censo paciente */
@Component({
  selector: 'censo-pacientes-detalles',
  templateUrl: './censo-pacientes.detalles.html',
  styleUrls: ['./censo-pacientes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CensoPacientesDetalles {
  constructor(
    public _dialogRef: MatDialogRef<CensoPacientesDetalles>,
    @Inject(MAT_DIALOG_DATA) public paciente: any
  ) {}
}
