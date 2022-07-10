import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CentroAtencionI } from 'src/app/application/interfaces/centro-atencion.interface';
import { ApiService } from 'src/app/application/services/api.service';
import { StoreService } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';
import * as interfaces from './estadistico-radicacion.interfaces';
import { Store } from '@ngrx/store';
import { ContextState } from 'src/app/infrastructure/redux/reducers/context.reducer';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/application/services/toast.service';
import { ValueService } from 'src/app/application/services/value.service';
import { EstadisticoRadicacionDialog } from './dialog/dialog.component';
import { ERFinalReporte, ERInicioReporte } from '../informes-gerenciales.forms';

@Component({
  selector: 'app-estadistico-radicacion',
  templateUrl: './estadistico-radicacion.component.html',
  styleUrls: ['./estadistico-radicacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoRadicacion implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  myForm = new FormGroup({
    inicioReporte: ERInicioReporte,
    finalReporte: ERFinalReporte,
  });
  context: string = '';
  centroAtencion: FormControl = new FormControl(0, [Validators.required]);
  onConsult: boolean = false;
  loading: boolean = false;
  rangoConsulta!: string;
  centrosAtencion!: CentroAtencionI[];
  _id1!: number;
  _id2!: number;
  // Radicación diaria
  labelsRadicacionDiaria!: string[];
  dataRadicacionDiaria!: any;
  showRadicacionDiaria: boolean = false;
  // Radicación acumulada
  labelsRadicacionAcumulada!: string[];
  dataRadicacionAcumulada!: any;
  showRadicacionAcumulada: boolean = false;
  //resumen del informe
  resumenInforme: any;
  data: any;
  estadisticas: any;

  centrosArray: any = [
    { value: 0, option: 'TODOS' },
    { value: 1, option: 'CLINICA MEDICOS SA' },
    { value: 2, option: 'ALTA COMPLEJIDAD DEL CARIBE' },
  ];

  constructor(
    private store: StoreService,
    private _timer: TimerService,
    private api: ApiService,
    private rdxStore: Store<ContextState>,
    private dialog: MatDialog,
    private toast: ToastService,
    private value: ValueService,
    private cd: ChangeDetectorRef
  ) {
    this.rdxStore
      .select('context')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(context => {
        this.context = context;
      });
    this.centroAtencion.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.onUpdate();
    });
  }

  ngOnInit(): void {
    this.store.centroAtencion$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (!data.wasLoaded) {
        this.getCentros();
      } else {
        this.centrosAtencion = data.centros;
        this._id1 = this.centrosAtencion[0].id;
        if (this.centrosAtencion.length === 1) {
          this._id2 = this.centrosAtencion[0].id;
        } else {
          this._id2 = this.centrosAtencion[1].id;
        }
      }
    });
  }

  private getCentros(): void {
    this.api.get('center-of-attention').subscribe(res => {
      if (res.success) {
        this.centrosAtencion = res.data;
        this._id1 = this.centrosAtencion[0].id;
        if (this.centrosAtencion.length === 1) {
          this._id2 = this.centrosAtencion[0].id;
        } else {
          this._id2 = this.centrosAtencion[1].id;
        }
        this.store.setCentroAtencion({
          wasLoaded: true,
          centros: res.data,
        });
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.onUpdate();
  }

  onUpdate() {
    this.showRadicacionDiaria = false;
    this.showRadicacionAcumulada = false;
    if (this.centroAtencion.value === 0) {
      this.getRadicacionFacturacion(this._id1, this._id2);
    } else {
      this.getRadicacionFacturacion(this.centroAtencion.value, this.centroAtencion.value);
    }
  }

  openModal(key: number) {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    const url = `radicacion-de-facturacion/facturas-pendientes`;
    this.api.get(url).subscribe(res => {
      this.dialog.open(EstadisticoRadicacionDialog, {
        data: {
          key: key,
          description: res.message,
          data: res.data,
          inicioReporte: inicioReporte,
          finalReporte: finalReporte,
          rowWidthsInPx: [110, 90, 320, 200, 120],
        },
      });
    });
  }
  private getRadicacionFacturacion(
    id1: number = this._id1,
    id2: number = this._id2
  ): void {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    const url =
      `radicacion-de-facturacion?fechaInicio=${inicioReporte}` +
      `&fechaFin=${finalReporte}&centro1=${id1}&centro2=${id2}`;
    this.api.get(url).subscribe(res => {
      if (res.success) {
        this.loading = false;
        this.data = res.data;
        this.rangoConsulta = `${this._timer.formatDate(inicioReporte, 2)} A
            ${this._timer.formatDate(finalReporte, 2)}`;
        this.resumenInforme = res.data.resumen[0];
        this.estadisticas = [
          {
            title: `Facturado`,
            subtitle: `${this.resumenInforme.FACTURAS} factura(s)`,
            result: this.value.convertNullToZero(this.resumenInforme.TOTALFACTURADO),
          },
          {
            title: `Anulado`,
            subtitle: `${this.resumenInforme.ANULADAS} factura(s)`,
            result: this.value.convertNullToZero(this.resumenInforme.TOTALANULADO),
          },
          {
            title: `Radicable`,
            subtitle: `${this.resumenInforme.RADICABLES} factura(s)`,
            result: this.value.convertNullToZero(this.resumenInforme.TOTALRADICABLE),
          },
          {
            title: `Radicado`,
            subtitle: `${this.resumenInforme.RADICADOS} factura(s)`,
            result: this.value.convertNullToZero(this.resumenInforme.TOTALRADICADO),
          },
          {
            title: `Cumplimiento`,
            subtitle: '',
            result: `${this.value.convertNullToZero(this.resumenInforme.CUMPLIMIENTO)}`,
            result2: `${100 - this.resumenInforme.CUMPLIMIENTO}`,
          },
          {
            title: `Pend. radicar`,
            subtitle: `${res.data.pendientes[0].Cantidad} factura(s)`,
            result: res.data.pendientes[0].Total,
          },
        ];
        setTimeout(() => {
          this.instanciarGraficas(
            res.data.radicacionDiaria,
            res.data.radicacionAcumulada
          );
          this.cd.markForCheck();
        }, 500);
        this.onConsult = true;
      } else {
        this.loading = false;
      }
      this.cd.markForCheck();
    });
  }

  private instanciarGraficas(
    rd: interfaces.RadicacionDiariaI[],
    ra: interfaces.RadicacionAcumuladaI[]
  ): void {
    let labels = [];
    for (let i = 0; i < ra.length; i++) {
      labels.push(ra[i].DIA.toString());
    }
    //Radicación Diaria
    let RDanuladas = [];
    let RDradicadas = [];
    let RDpendientes = [];
    for (let i = 0; i < rd.length; i++) {
      RDanuladas.push(rd[i].ANULADAS.toString());
      RDradicadas.push(rd[i].TOTALRADICADO.toString());
      RDpendientes.push(rd[i].PENDIENTE.toString());
    }
    this.dataRadicacionDiaria = [
      { data: RDanuladas, label: 'anuladas', stack: 'a' },
      { data: RDradicadas, label: 'radicadas', stack: 'a' },
      { data: RDpendientes, label: 'pendientes', stack: 'a' },
    ];
    this.labelsRadicacionDiaria = labels;
    this.showRadicacionDiaria = true;
    //Radicación Acumulada
    let RAradicado = [];
    let RAfacturado = [];
    for (let i = 0; i < ra.length; i++) {
      RAradicado.push(ra[i].ACUMULADORADICADO === null ? 0 : ra[i].ACUMULADORADICADO);
      RAfacturado.push(ra[i].FACT === null ? 0 : ra[i].FACT);
    }

    let diasRestantes: number = labels.length - ra.length;
    if (diasRestantes > 0) {
      RAradicado.push(0);
      RAfacturado.push(0);
    }
    (this.dataRadicacionAcumulada = [
      {
        label: 'Acumulado',
        data: RAradicado,
      },
      {
        label: 'Radicado',
        data: RAfacturado,
      },
    ]),
      (this.labelsRadicacionAcumulada = labels);
    this.showRadicacionAcumulada = true;
  }

  getInformation(key: number) {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    let description: string = '';
    let data: any = [];
    let rowWidthsInPx: number[] = [200, 40, 40, 40, 120, 120, 120, 40];
    let displayedColumns: any = [
      'CANT',
      'RAD',
      'ANU',
      'FACTURADO',
      'RADICABLE',
      'RADICADO',
      'PORC',
    ];
    if (key === 1) {
      description = 'Radicación por documentos';
      data = this.data.radicacionDocumentos;
      displayedColumns.unshift('SFATIPDOC');
    }
    if (key === 2) {
      description = 'Radicación por estado';
      data = this.data.radicacionEstado;
      displayedColumns.unshift('CRFESTADO');
    }
    if (key === 3) {
      description = 'Radicación por entidades';
      data = this.data.radicacionEntidades;
      displayedColumns.unshift('GTRNOMBRE');
      rowWidthsInPx = [320, 40, 40, 40, 115, 115, 115, 115];
    }
    if (key === 4) {
      description = 'Radicación confirmada por usuarios';
      data = this.data.radicacionUsuario;
      displayedColumns.unshift('USUDESCON');
      rowWidthsInPx = [300, 40, 40, 40, 120, 120, 120, 120];
    }
    if (key === 5) {
      description = 'Radicación de usuarios en entidad';
      data = this.data.radicacionUsuarioPorEntidad;
      displayedColumns.unshift('USUDESENT');
    }
    if (data.length > 0) {
      this.dialog.open(EstadisticoRadicacionDialog, {
        //minHeight: 'calc(50vh + 110px)',
        data: {
          key: key,
          description: description,
          displayedColumns: displayedColumns,
          data: data,
          inicioReporte: inicioReporte,
          finalReporte: finalReporte,
          rowWidthsInPx: rowWidthsInPx,
        },
      });
    } else {
      this.toast.notification('no hay items en esta lista');
    }
  }

  backToForm() {
    this.onConsult = false;
  }
  getToplineClass(title: string) {
    if (title === 'Facturado') {
      return 'bg-green';
    } else if (title === 'Anulado') {
      return 'bg-red';
    } else if (title === 'Radicable') {
      return 'bg-gray';
    } else if (title === 'Radicado') {
      return 'bg-violet';
    } else if (title === 'Cumplimiento') {
      return 'bg-blue';
    } else if (title === 'Pend. radicar') {
      return 'bg-orange';
    } else {
      return 'null';
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  get inicioReporte(): FormControl {
    return this.myForm.controls['inicioReporte'] as FormControl;
  }
  get finalReporte(): FormControl {
    return this.myForm.controls['finalReporte'] as FormControl;
  }
}
