import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SUFecha, SUIngreso } from '../balances-enfermeria.forms';
import * as interfaces from './sabanas-uci.interfaces';
import { StadisticI } from 'src/app/application/interfaces/stadistic.interface';
import { StoreService } from 'src/app/application/services/store.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';
import { SabanasUciService } from './sabanas-uci.services';
import { BalancesEnfermeriaStore } from '../balances-enfermeria.store';
import { TimerService } from 'src/app/application/services/timer.service';

@Component({
  selector: 'app-sabanas-uci',
  templateUrl: './sabanas-uci.component.html',
  styleUrls: ['./sabanas-uci.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SabanasUci implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();

  public onConsult: boolean = false;
  public loading: boolean = false;
  public loadingTable: boolean = false;

  public myForm = new FormGroup({
    ingreso: SUIngreso,
    fecha: SUFecha,
  });
  get ingreso(): FormControl {
    return this.myForm.controls.ingreso as FormControl;
  }
  get fecha(): FormControl {
    return this.myForm.controls.fecha as FormControl;
  }

  public infoIngreso!: StadisticI[];
  public signos!: StadisticI[];
  public liquidos!: StadisticI[];
  public glucometria!: interfaces.GlucometriaI;
  public estadisticas!: StadisticI[];
  public subgruposLiquidosPerdidos!: string[];
  public estadisticasTopLineBg = [
    'bg-green',
    'bg-red',
    'bg-yellow',
    'bg-blue',
    'bg-orange',
    'bg-violet',
  ];
  public displayedColumns = [
    'AINCONSEC',
    'GPANOMPAC',
    'HSUNOMBRE',
    'HCRPESO',
    'ACANOMBRE',
  ];
  public columnNames = ['Ingreso', 'Nombre', 'Subgrupo', 'Peso', 'Clínica'];

  public fechaReporte!: string;

  constructor(
    private _balancesEnfermeriaStore: BalancesEnfermeriaStore,
    private _sabanasUciService: SabanasUciService,
    private _cd: ChangeDetectorRef,
    private _toast: ToastService,
    private _modal: ModalService,
    private _store: StoreService,
    private _timer: TimerService,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    this.subgruposLiquidosPerdidos =
      this._sabanasUciService.getSubgruposLiquidosPerdidos();
    this._balancesEnfermeriaStore.pacientesSinPeso$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(data => {
        if (data.wasLoaded) {
          this._store.setDataSource(data.dataSource, data.lastUpdated, true);
        } else {
          this.getPacientesSinPeso();
        }
      });
  }

  public getPacientesSinPeso(): void {
    this.loadingTable = true;
    const url = `uci-sheets/pacientes`;
    this._api.get(url).subscribe({
      next: res => {
        if (res.success) {
          this._balancesEnfermeriaStore.setPacientesSinPeso(res.data, true);
        } else {
          this._toast.notification('No se pudieron obtener los pacientes sin peso');
        }
        this.loadingTable = false;
        this._cd.markForCheck();
      },
      error: () => {
        this.loadingTable = false;
        this._toast.notification('Ocurrió un error al solicitar la información');
        this._cd.markForCheck();
      },
    });
  }

  public onSubmit(): void {
    if (this.myForm.valid) {
      this.loading = true;
      const url = `uci-sheets?Ingreso=${this.ingreso.value}&Fecha=${
        this.fecha.value.toISOString().split('T')[0]
      }`;
      const badRequestMsg = 'No hay reportes para este ingreso en esta fecha';
      this._api.get(url).subscribe({
        next: res => {
          const data = res.data;
          if (res.success && data.infoIngreso.length !== 0) {
            if (data.infoIngreso[0] !== undefined && data.infoIngreso[0].PESO === 0) {
              this._modal.alert(
                'Este paciente no tiene peso registrado, por ende los ' +
                  'calculos de gasto urinario y perdida insensible estarán alterados',
                'ADVERTENCIA'
              );
            }
            this.fechaReporte = this._timer.formatDate(this.fecha.value, 6);
            this._gestionResultados(data);
          } else {
            this._toast.notification(badRequestMsg);
          }
          this.loading = false;
          this._cd.markForCheck();
        },
        error: () => {
          this._toast.notification(badRequestMsg);
          this.loading = false;
          this._cd.markForCheck();
        },
      });
    }
  }

  private _gestionResultados(data: any): void {
    const infoIngreso: interfaces.InfoIngresoI = data.infoIngreso[0];
    const glucometria: interfaces.GlucometriaI = data.glucometria;
    const signos: interfaces.SignosI[] = data.signos;
    const liquidos: interfaces.LiquidosI[] = data.liquidos;
    this.infoIngreso = [
      { value: 'INGRESO', result: infoIngreso.CONS_INGRESO },
      { value: 'NOMBRE PACIENTE', result: infoIngreso.GPANOMCOM },
      { value: 'IDENTIFICACIÓN', result: infoIngreso.PACNUMDOC },
      { value: 'CAMA', result: infoIngreso.CAMA },
      { value: 'CONTRATO', result: infoIngreso.GDENOMBRE },
      { value: 'PESO', result: `${infoIngreso.PESO} KL(S)` },
    ];
    this.glucometria = glucometria;
    this.signos = this._sabanasUciService.addUndocumentHours(
      signos,
      'signo',
      'resultados',
      'hora'
    );
    this.liquidos = this._sabanasUciService.addUndocumentHours(
      liquidos,
      'liquido',
      'resultado',
      'hora'
    );
    this.estadisticas = [
      {
        key: 1,
        value: 'Liquidos Administrados',
        result: data.balanceLiquidos.liquidosAdministrados,
      },
      {
        key: 2,
        value: 'Liquidos Eliminados',
        result: data.balanceLiquidos.totalLiquidosEliminados,
      },
      {
        key: 3,
        value: 'Balance Acumulado',
        result: data.balanceLiquidos.balanceAcumulado,
      },
      {
        key: 4,
        value: 'Gasto Urinario',
        result: data.balanceLiquidos.gastoUrinario,
      },
      {
        key: 5,
        value: 'Perdida Insensible',
        result: data.balanceLiquidos.perdidaInsensible,
      },
      {
        key: 6,
        value: 'Balance 24H',
        result: data.balanceLiquidos.balance24Horas,
      },
    ];
    this.onConsult = true;
  }

  public backToForm(): void {
    this.onConsult = false;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
