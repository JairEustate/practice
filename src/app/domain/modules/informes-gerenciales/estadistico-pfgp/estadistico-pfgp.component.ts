import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { EPInicioReporte, EPFinalReporte } from '../informes-gerenciales.forms';
import { CentroAtencionI } from 'src/app/application/interfaces/centro-atencion.interface';
import { ContextState } from 'src/app/infrastructure/redux/reducers/context.reducer';
import { HighchartsService } from 'src/app/application/services/highcharts.service';
import { StoreService } from 'src/app/application/services/store.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ApiService } from 'src/app/application/services/api.service';
@Component({
  selector: 'app-estadistico-pfgp',
  templateUrl: './estadistico-pfgp.component.html',
  styleUrls: ['./estadistico-pfgp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoPfgp implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public centrosAtencion!: CentroAtencionI[];
  public myForm = new FormGroup({
    inicioReporte: EPInicioReporte,
    finalReporte: EPFinalReporte,
  });
  get inicioReporte(): FormControl {
    return this.myForm.controls.inicioReporte as FormControl;
  }
  get finalReporte(): FormControl {
    return this.myForm.controls.finalReporte as FormControl;
  }
  public loading: boolean = false;
  public onConsult: boolean = false;
  public isActualMonth: boolean = false;
  public isLastMonth: boolean = false;
  public dateConsult: any = '';
  public context: string = '';
  public showGraficas: boolean = false;
  public showFacturado: boolean = false;
  public showAcostado: boolean = false;
  public showConsolidado: boolean = false;
  public diferenciaConsolidado: any = null;

  constructor(
    private _rdxStore: Store<ContextState>,
    private _highcharts: HighchartsService,
    private _store: StoreService,
    private _timer: TimerService,
    private _toast: ToastService,
    private _api: ApiService
  ) {
    this._rdxStore
      .select('context')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(context => {
        this.context = context;
      });
  }

  public ngOnInit(): void {
    this._getCentrosAtencion();
    this._highcharts.translateHighcharts('es');
  }

  private _getCentrosAtencion(): void {
    this._store.centroAtencion$.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (data.wasLoaded) {
        this.centrosAtencion = data.centros;
      }
    });
  }

  public onSubmit(): void {
    this.loading = true;
    // Remueve zona horaria y hora de las fechas.
    const inicioReporte = this._timer.splitFromT(this.inicioReporte.value);
    const finalReporte = this._timer.splitFromT(this.finalReporte.value);
    // Ejecutar SI la fecha final es superior al ultimo día del mes.
    if (this._timer.getDate(finalReporte) > this._timer.lastDayOfActualMonth()) {
      this._toast.notification('Las fechas no pueden ser superiores al mes actual');
      this.loading = false;
    }
    // Ejecutar si la fecha final NO es superior al ultimo día del mes.
    else {
      const start = this._timer.formatDate(inicioReporte, 2);
      const end = this._timer.formatDate(finalReporte, 2);
      this.dateConsult = `${start} A ${end}`;
      // Ejecutar SI inicioReporte pertenece al mes actual.
      if (this._timer.belongsToCurrentMonth(inicioReporte)) {
        this.isActualMonth = true;
      }
      // Ejecutar si inicioReporte pertenece al mes anterior al actual.
      if (this._timer.belongsToLastMonth(inicioReporte)) {
        this.isLastMonth = true;
      }
      // Ejecutar despues de validar en que mes se ubica la fecha seleccionada.
      // Ejecutar SI inicioReporte pertenece al mes ACTUAL.
      if (this.isActualMonth) {
        this.showConsolidado = true;
        this.showGraficas = true;
        this._getDiferenciaConsolidado();
      }
      // Ejecutar SI inicioReporte pertenece al mes ACTUAL o al mes ANTERIOR.
      else if (this.isActualMonth || this.isLastMonth) {
        this.showFacturado = true;
        this.showAcostado = true;
        this.showGraficas = true;
      }
      // Ejecutar si inicioReporte NO pertenece al mes ACTUAL ni al mes ANTERIOR.
      else if (!this.isActualMonth && !this.isLastMonth) {
        this.showFacturado = true;
        this.showGraficas = true;
      }
      this.loading = false;
      this.onConsult = true;
    }
  }

  private _getDiferenciaConsolidado(): void {
    const inicioReporte = this._timer.splitFromT(this.inicioReporte.value);
    const finalReporte = this._timer.splitFromT(this.finalReporte.value);
    const url = `pgp/diferencia-consolidado?fechaInicio=${inicioReporte}&fechaFin=${finalReporte}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.diferenciaConsolidado = res.data;
        this.showFacturado = true;
        this.showAcostado = true;
      }
    });
  }

  public backToForm(): void {
    this.diferenciaConsolidado = null;
    this.onConsult = false;
    this.isActualMonth = false;
    this.isLastMonth = false;
    this.showFacturado = false;
    this.showAcostado = false;
    this.showConsolidado = false;
    this.showGraficas = false;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
