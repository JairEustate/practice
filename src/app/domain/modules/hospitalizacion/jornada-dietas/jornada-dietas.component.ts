import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/application/services/api.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as interfaces from './jornada-dietas.interfaces';
import { StoreService } from 'src/app/application/services/store.service';

@Component({
  selector: 'app-jornada-dietas',
  templateUrl: './jornada-dietas.component.html',
  styleUrls: ['./jornada-dietas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JornadaDietas implements OnInit {
  private _unsubscribe$ = new Subject<void>();
  public loading: boolean = false;
  public displayedColumns: any = [
    'CODIGO',
    'FECHA_REPORTE',
    'CENTRO_ATENCION',
    'JORNADA',
    'TOTAL_PACIENTES',
    'VALOR_JORNADA',
  ];
  public columnNames: any = [
    'Cód.',
    'Fecha',
    'Centro de Atención',
    'Jornada',
    'Pac.',
    'Valor',
  ];
  public dataSource: any = [];
  public hasSelectableRows: boolean = true;
  public rowWidthsInPx: number[] = [60, 150, 250, 100, 100, 100];
  public columnResalted: string = 'CODIGO';
  public fecha: FormControl = new FormControl(new Date());
  public title: string = 'Catálogo de jornada de dietas en hospitalización';
  public subtitle!: string;
  public dateToConsult: any = new Date();
  public firstConsult: boolean = true;
  public catalogoDietas!: interfaces.JornadaDietaI | any;
  public onVisualizeCatalogo: boolean = true;
  public generatePdf: boolean = false;
  public combinaciones: any = [];

  constructor(
    private _cd: ChangeDetectorRef,
    private _timer: TimerService,
    private _toast: ToastService,
    private _store: StoreService,
    private _api: ApiService
  ) {
    this.fecha.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
      this.subtitle = `${this._timer.formatDate(this.fecha.value, 6)}`;
      this.getInfoCatalogo();
    });
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.subtitle = this._timer.formatDate(new Date(), 6, false);
      this._cd.markForCheck();
    }, 200);
    this.dataSource = new MatTableDataSource<interfaces.JornadaDietaI>([]);
    this.getInfoCatalogo();
  }

  public actualizarCatalogo(): void {
    this.loading = true;
    this.getInfoCatalogo();
  }

  public getInfoCatalogo(): void {
    this._api.get(`diet-patients/jornada?Fecha=${this.fecha.value}`).subscribe(res => {
      if (res.success) {
        if (res.data.count.length > 0) {
          let newArray: any = [];
          for (let i = 0; i < res.data.count.length; i++) {
            newArray.push({
              CODIGO: res.data.count[i].GCMDIEJOR,
              FECHA_REPORTE: res.data.dietas[i].fecha,
              CENTRO_ATENCION: res.data.dietas[i].adncenate,
              JORNADA: res.data.dietas[i].jornda,
              TOTAL_PACIENTES: res.data.count[i].PACIENTES,
              VALOR_JORNADA: res.data.totalJornada[i].TOTALJORNADA,
            });
          }
          this.catalogoDietas = newArray;
          this._store.setDataSource(newArray, null, true);
          this.dataSource = newArray;
          this.loading = false;
        } else {
          this._toast.notification(
            'No se encontraron dietas en la jornada definida actualmente'
          );
          this._store.setDataSource([], null, true);
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    });
  }

  public getDietas(row: interfaces.JornadaDietaI): void {
    this.onVisualizeCatalogo = false;
    this.title = `Jornada: ${row.JORNADA} (${row.CENTRO_ATENCION})`;
    this.displayedColumns = [
      'CAMA',
      'PACIENTE',
      'JORNADA_DIETA',
      'TIPO_DIETA',
      'CONSISTENCIA_DIETA',
      'VALOR_DIETA',
    ];
    this.columnNames = ['Cama', 'Paciente', 'Jornada', 'Tipo', 'Consistencia', 'Valor'];
    this._api.get(`diet-patients/estado?jornada=${row.CODIGO}`).subscribe(res => {
      if (res.success) {
        this.combinaciones = res.data.combinaciones;
        let newArray: any = [];
        for (let i = 0; i < res.data.pacientes.dietaEstado.length; i++) {
          newArray.push({
            CAMA: res.data.pacientes.dietaEstado[i].CAMA,
            PACIENTE: res.data.pacientes.dietaEstado[i].GPANOMPAC,
            JORNADA_DIETA: res.data.pacientes.dietaEstado[i].JORNADA,
            TIPO_DIETA: res.data.pacientes.dietaEstado[i].TIPO,
            CONSISTENCIA_DIETA: res.data.pacientes.dietaEstado[i].CONSISTENCIA,
            VALOR_DIETA: res.data.pacientes.dietaEstado[i].VALOR,
          });
          this._store.setDataSource(newArray, null, true);
          this.dataSource = newArray;
          this.hasSelectableRows = false;
          this.rowWidthsInPx = [100, 300, 80, 300, 150, 80];
          this.columnResalted = 'CAMA';
        }
      } else {
        this.loading = false;
      }
    });
  }

  public backToCatalogo(): void {
    this.onVisualizeCatalogo = true;
    this.combinaciones = [];
    this.title = 'Catálogo de jornada de dietas en hospitalización';
    this.displayedColumns = [
      'CODIGO',
      'FECHA_REPORTE',
      'CENTRO_ATENCION',
      'JORNADA',
      'TOTAL_PACIENTES',
      'VALOR_JORNADA',
    ];
    this.columnNames = [
      'Cód.',
      'Fecha',
      'Centro de Atención',
      'Jornada',
      'Pac.',
      'Valor',
    ];
    this._store.setDataSource(this.catalogoDietas, null, true);
    this.dataSource = this.catalogoDietas;
    this.hasSelectableRows = true;
    this.rowWidthsInPx = [60, 150, 250, 100, 100, 100];
    this.columnResalted = 'CODIGO';
  }

  public generarReporte(): void {
    this.generatePdf = true;
    setTimeout(() => {
      this.generatePdf = false;
    }, 3000);
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
