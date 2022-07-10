import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { CentroAtencionI } from 'src/app/application/interfaces/centro-atencion.interface';
import { ContextState } from 'src/app/infrastructure/redux/reducers/context.reducer';
import { StoreService } from 'src/app/application/services/store.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ApiService } from 'src/app/application/services/api.service';
import { FacturacionPeriodoDialog } from './dialog/dialog.component';
import { FPFinalReporte, FPInicioReporte } from '../informes-gerenciales.forms';

@Component({
  selector: 'app-facturacion-periodo',
  templateUrl: './facturacion-periodo.component.html',
  styleUrls: ['./facturacion-periodo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturacionPeriodo implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public myForm = new FormGroup({
    inicioReporte: FPInicioReporte,
    finalReporte: FPFinalReporte,
  });
  get inicioReporte(): FormControl {
    return this.myForm.controls['inicioReporte'] as FormControl;
  }
  get finalReporte(): FormControl {
    return this.myForm.controls['finalReporte'] as FormControl;
  }
  public context: string = '';
  public centroAtencion: FormControl = new FormControl(0, [Validators.required]);
  public onConsult: boolean = false;
  public loading: boolean = false;
  public rangoConsulta!: string;
  public centrosAtencion!: CentroAtencionI[];
  public showProduccionUsuarios: boolean = false;
  public showInfoUsuarios: boolean = false;
  public produccionUsuarios!: any[];
  public produccionUsuariosData: any;
  public produccionUsuariosP1!: any[];
  public produccionUsuariosP2!: any[];
  public titlePage: string = 'Informe de producción en facturación por periodo';
  public displayedColumns: any = [
    'NOMBRE',
    'DOCUMENTOS',
    'PROMEDIODOC',
    'FACTURASANULADAS',
    'PRODUCCION',
    'PROMEDIOFACT',
    'TOTALFACTURASANULADAS',
  ];
  public columnNames: any = [
    'Nombre',
    'Can.',
    'Prom.',
    'Anu.',
    'Producción',
    'Promedio',
    'Anulado',
  ];
  public _id1!: number;
  public _id2!: number;
  // Facturación acumulada
  public labelsFacturacionAcumulada!: string[];
  public dataFacturacionAcumulada!: any;
  public showFacturacionAcumulada: boolean = false;
  // Facturación diaria
  public labelsFacturacionDiaria!: string[];
  public dataFacturacionDiaria!: any;
  public showFacturacionDiaria: boolean = false;
  public loadingFacturasUsuarios: boolean = false;
  // Egresos del periodo
  public labelsEgresosPeriodo!: string[];
  public dataEgresosPeriodo!: any;
  public showEgresosPeriodo: boolean = false;
  // Facturación acumulada
  public labelsFacturasUsuarios!: string[];
  public dataFacturasUsuarios!: any;
  public showFacturasUsuarios: boolean = false;
  //resumen del informe
  public resumenInforme: any;
  public data: any;
  public dataUsuario: any;
  public topLineColor: string = '';
  public centrosArray: any = [
    { value: 0, option: 'TODOS' },
    { value: 1, option: 'CLINICA MEDICOS SA' },
    { value: 2, option: 'ALTA COMPLEJIDAD DEL CARIBE' },
  ];

  constructor(
    private _store: StoreService,
    private _timer: TimerService,
    private _api: ApiService,
    private _rdxStore: Store<ContextState>,
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _cd: ChangeDetectorRef
  ) {
    this._rdxStore
      .select('context')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(context => {
        this.context = context;
      });
    this.centroAtencion.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
      this.onUpdate();
    });
  }

  public ngOnInit(): void {
    this._store.centroAtencion$.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (!data.wasLoaded) {
        this._getCentros();
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

  private _getCentros(): void {
    this._api.get('center-of-attention').subscribe(res => {
      if (res.success) {
        this.centrosAtencion = res.data;
        this._id1 = this.centrosAtencion[0].id;
        if (this.centrosAtencion.length === 1) {
          this._id2 = this.centrosAtencion[0].id;
        } else {
          this._id2 = this.centrosAtencion[1].id;
        }
        this._store.setCentroAtencion({
          wasLoaded: true,
          centros: res.data,
        });
      }
    });
  }

  public onSubmit(): void {
    this.loading = true;
    this.onUpdate();
    this.getData();
  }

  public onUpdate(): void {
    if (this.centroAtencion.value === 0) {
      this._getProduccion(this._id1, this._id2);
    } else {
      this._getProduccion(this.centroAtencion.value, this.centroAtencion.value);
    }
  }

  private _getProduccion(id1: number = this._id1, id2: number = this._id2): void {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    this.rangoConsulta = `${this._timer.formatDate(inicioReporte, 2)} A
            ${this._timer.formatDate(finalReporte, 2)}`;
    const url = `facturacion/${inicioReporte}/${finalReporte}/${id1}/${id2}`;
    this._api.get(url).subscribe(res => {
      console.log(res.data);
      this.showEgresosPeriodo = false;
      this.showFacturacionAcumulada = false;
      this.showFacturacionDiaria = false;
      setTimeout(() => {
        this._instanciarGraficas(res.data.graficas);
        this._cd.markForCheck();
      }, 500);
      this.resumenInforme = res.data.resumen;
      this.onConsult = true;
      this.loading = false;
      this._cd.markForCheck();
    });
  }

  private getData(): void {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    const url = `facturacion/datas/${inicioReporte}/${finalReporte}`;
    this._api.get(url).subscribe(res => {
      this.data = res.data;
      this._cd.markForCheck();
    });
  }

  private _instanciarGraficas(graficas: any): void {
    const ef = graficas.EgresosFacturados;
    const fa = graficas.facturacionAcumulada;
    const fd = graficas.facturacionDiaria;
    let labels = [];
    for (let i = 0; i < ef.length; i++) {
      labels.push(ef[i].DIA.toString());
    }
    //Facturación Acumulada
    const faProduccion = [];
    const faProyeccion = [];
    const faDiasRestantes: number = labels.length - fa.length;
    for (let i = 0; i < fa.length; i++) {
      faProduccion.push(fa[i].PRODUCCION === null ? 0 : fa[i].PRODUCCION);
      faProyeccion.push(fa[i].PROYECCION === null ? 0 : fa[i].PROYECCION);
    }
    if (faDiasRestantes > 0) {
      faProduccion.push(0);
      faProyeccion.push(0);
    }
    this.dataFacturacionAcumulada = [
      {
        label: 'Facturado',
        data: faProduccion,
      },
      {
        label: 'Proyectado',
        data: faProyeccion,
      },
    ];
    this.labelsFacturacionAcumulada = labels;
    this.showFacturacionAcumulada = true;
    //Facturación Diaria
    const fdProduccion = [];
    const fdProyeccion = [];
    const fdDiasRestantes: number = labels.length - fd.length;
    for (let i = 0; i < fd.length; i++) {
      fdProduccion.push(fd[i].PRODUCCION === null ? 0 : fd[i].PRODUCCION);
      fdProyeccion.push(fd[i].PROYECCION === null ? 0 : fd[i].PROYECCION);
    }

    if (fdDiasRestantes > 0) {
      fdProduccion.push(0);
      fdProyeccion.push(0);
    }
    this.dataFacturacionDiaria = [
      {
        label: 'Facturado',
        data: fdProduccion,
      },
      {
        label: 'Proyectado',
        data: fdProyeccion,
      },
    ];
    this.labelsFacturacionDiaria = labels;
    this.showFacturacionDiaria = true;
    // Egresos del periodo
    const efFacturas = [];
    const efPendientes = [];
    for (let i = 0; i < ef.length; i++) {
      efFacturas.push(ef[i].FACTURAS === null ? 0 : ef[i].FACTURAS);
      efPendientes.push(ef[i].PENDIENTES === null ? 0 : ef[i].PENDIENTES);
    }
    this.dataEgresosPeriodo = [
      {
        data: efFacturas,
        label: 'facturas',
        stack: 'a',
      },
      {
        data: efPendientes,
        label: 'pendientes',
        stack: 'b',
      },
    ];
    this.labelsEgresosPeriodo = labels;
    this.showEgresosPeriodo = true;
  }

  public showInformation(key: number): void {
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    let description: string = '';
    let data: any = [];
    let rowWidthsInPx: number[] = [320, 39, 39, 39, 116, 116, 116, 116];
    let displayedColumns: any = [
      'NOMBRE',
      'DOCUMENTOS',
      'CANTIDADREFACTURADA',
      'FACTURASANULADAS',
      'PRODUCCION',
      'TOTALFACTURASANULADAS',
      'TOTALREFACTURADA',
      'FACTURADO',
    ];
    if (key === 1) {
      description = 'Producción por centros de atención';
      data = this.data.centros;
    }
    if (key === 2) {
      this.titlePage = 'Producción por usuarios';
      this.produccionUsuarios = this.data.usuarios;
    }
    if (key === 3) {
      description = 'Producción por documentos';
      data = this.data.documentos;
    }
    if (key === 4) {
      description = 'Producción por servicios de egreso';
      data = this.data.servicioEgresos;
    }
    if (key === 5) {
      description = 'Producción por entidades';
      data = this.data.entidades;
    }
    if (key === 6) {
      description = 'Producción por centros de atención';
      data = this.dataUsuario.centros;
      rowWidthsInPx = [200, 40, 40, 120, 120, 120];
    }
    if (key === 7) {
      description = 'Producción por documentos';
      data = this.dataUsuario.documentos;
      rowWidthsInPx = [250, 40, 40, 120, 120, 120];
    }
    if (key === 8) {
      description = 'Producción por servicios de egreso';
      data = this.dataUsuario.servicioEgresos;
      rowWidthsInPx = [300, 40, 40, 120, 120, 120];
    }
    if (key === 9) {
      description = 'Producción por entidades';
      data = this.dataUsuario.entidades;
      rowWidthsInPx = [310, 40, 40, 115, 115, 115];
    }
    if ([6, 7, 8, 9].indexOf(key) >= 0) {
      displayedColumns = [
        'NOMBRE',
        'DOCUMENTOS',
        'FACTURASANULADAS',
        'PRODUCCION',
        'TOTALFACTURASANULADAS',
        'FACTURADO',
      ];
    }
    if (key !== 2) {
      if (data.length > 0) {
        this._dialog.open(FacturacionPeriodoDialog, {
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
        this._toast.notification('No hay items en esta lista');
      }
    } else {
      const labels: any[] = [];
      const datas: any[] = [];
      const backgroundColors: any[] = [];
      let totalProduccion = 0;
      this.produccionUsuarios.map((r: any) => {
        const col1 = Math.floor(Math.random() * (255 - 1)) + 1;
        const col2 = Math.floor(Math.random() * (255 - 1)) + 1;
        const col3 = Math.floor(Math.random() * (255 - 1)) + 1;
        r.color = `rgb(${col1}, ${col2}, ${col3})`;
        r.colorOpacity = `rgb(${col1}, ${col2}, ${col3},0.5)`;
        labels.push(`${r.NOMBRE} (%)`);
        backgroundColors.push(r.color);
        totalProduccion += r.PRODUCCION;
      });
      this.produccionUsuarios.map((r: any) => {
        r.PORCENTAJEPRODUCCION = (r.PRODUCCION * 100) / totalProduccion;
        datas.push(r.PORCENTAJEPRODUCCION);
      });
      this.produccionUsuariosData = {
        labels: labels,
        datasets: [
          {
            label: 'Producción por usuarios',
            data: datas,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
            hoverBorderColor: backgroundColors,
            hoverOffset: 4,
          },
        ],
      };
      let val1;
      let val2;
      if (this.produccionUsuarios.length % 2 == 0) {
        val1 = this.produccionUsuarios.length / 2;
        val2 = this.produccionUsuarios.length + 1;
      } else {
        val1 = this.produccionUsuarios.length / 2 + 0.5;
        val2 = this.produccionUsuarios.length + 1;
      }
      this.produccionUsuariosP1 = this.produccionUsuarios.slice(0, val1);
      this.produccionUsuariosP2 = this.produccionUsuarios.slice(val1, val2);
      this._store.setDataSource(this.produccionUsuarios);
      this.showProduccionUsuarios = true;
    }
  }

  public onSelectRow(row: any): void {
    this.loadingFacturasUsuarios = true;
    const inicioReporte = this.inicioReporte.value.toISOString().split('T')[0];
    const finalReporte = this.finalReporte.value.toISOString().split('T')[0];
    const url = `facturacion/usuario?fechaInicio=${inicioReporte}&fechaFin=${finalReporte}&usuario=${row.CODUSUARIO}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.dataUsuario = res.data;
        this.dataUsuario.resumen[0].TOTALREFACTURADA =
          row.TOTALREFACTURADA !== null ? row.TOTALREFACTURADA : 0;
        this.dataUsuario.resumen[0].PROMEDIOFACT =
          row.PROMEDIOFACT !== null ? row.PROMEDIOFACT : 0;
        this.dataUsuario.resumen[0].PROMEDIOFACTSUB =
          row.PROMEDIOFACTSUB !== null ? row.PROMEDIOFACTSUB : 0;
        this.dataUsuario.resumen[0].PROMEDIODOC =
          row.PROMEDIODOC !== null ? row.PROMEDIODOC : 0;
        this.dataUsuario.resumen[0].PRODUCCION =
          row.PRODUCCION !== null ? row.PRODUCCION : 0;
        this.dataUsuario.resumen[0].PROMEDIOREFACT =
          row.PROMEDIOREFACT !== null ? row.PROMEDIOREFACT : 0;
        //Núm. de facturas vs. Días del periodo
        let labels = [];
        const grafica = res.data.grafica;
        for (let i = 0; i < grafica.length; i++) {
          labels.push(grafica[i].DIA.toString());
        }
        const facturas = [];
        const faDiasRestantes: number = labels.length - grafica.length;
        for (let i = 0; i < grafica.length; i++) {
          facturas.push(grafica[i].FACTURAS === null ? 0 : grafica[i].FACTURAS);
        }
        if (faDiasRestantes > 0) {
          facturas.push(0);
        }
        this.dataFacturasUsuarios = [
          {
            label: 'Facturas',
            data: facturas,
            backgroundColor: row.colorOpacity,
            borderColor: row.color,
            pointBorderColor: row.color,
            pointHoverBorderColor: row.color,
            pointBackgroundColor: row.color,
            pointHoverBackgroundColor: row.color,
          },
        ];
        this.topLineColor = row.color;
        this.labelsFacturasUsuarios = labels;
        this.showFacturasUsuarios = true;
        this.titlePage = row.NOMBRE;
        this.showProduccionUsuarios = false;
        this.showInfoUsuarios = true;
      } else {
        this._toast.notification('No se obtuvieron los datos correctamente');
      }
      this.loadingFacturasUsuarios = false;
      this._cd.markForCheck();
    });
  }

  public backToForm(): void {
    if (this.showInfoUsuarios && !this.showProduccionUsuarios) {
      this.showProduccionUsuarios = true;
      this.showInfoUsuarios = false;
      this.titlePage = 'Producción por usuarios';
    } else if (!this.showInfoUsuarios && this.showProduccionUsuarios) {
      this.showProduccionUsuarios = false;
      this.titlePage = 'Informe de producción en facturación por periodo';
    } else if (!this.showInfoUsuarios && !this.showProduccionUsuarios) {
      this.onConsult = false;
    }
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
