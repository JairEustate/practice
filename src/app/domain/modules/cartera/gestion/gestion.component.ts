import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/application/services/api.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { SuggestionI } from 'src/app/application/interfaces/suggestion.interface';
import { StoreService } from 'src/app/application/services/store.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { AuthTokenI } from 'src/app/application/interfaces/auth-token.interface';
import { GestionI } from './gestion.interfaces';
import * as _ from 'lodash';
import { JwtService } from 'src/app/application/services/jwt.service';
import { TimerService } from 'src/app/application/services/timer.service';
import {
  GFecha,
  GErp,
  GNit,
  GContacto,
  GResponsable,
  GVisitaCobro,
  GObservaciones,
  GTipoConciliacion,
  GFechaConciliacion,
} from '../cartera.forms';
import { CarteraStore } from '../cartera.store';
import { CARTERA_ADMINS } from '../cartera.admin';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gestion implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public displayedColumns: string[] = [
    'OID',
    'FECHA',
    'GENUSUARIO',
    'GENTERCER',
    'RESPTERC',
    'MOTLLAMAD',
    'FECHCONCI',
  ];
  public columnNames: string[] = [
    'Cod.',
    'Fecha Gestión',
    'Usuario',
    'ERP',
    'Resp. ERP',
    'Mot. llamada',
    'Fecha Conciliación',
  ];
  public userId!: number;
  public resetBtnId: string = 'gestion-form-reset';
  public ERP!: { OID: number; TERNOMCOM: string; TERNUMDOC: string };
  public visitaCobroSuggestions: SuggestionI[] = [
    { value: 'VISITA COBRO', option: 'VISITA COBRO' },
    { value: 'VISITA SOPORTE PAGO', option: 'VISITA SOPORTE PAGO' },
    { value: 'VISITA CONCILIACION', option: 'VISITA CONCILIACION' },
    { value: 'LLAMADA COBRO', option: 'LLAMADA COBRO' },
    { value: 'LLAMADA SOPORTE PAGO', option: 'LLAMADA SOPORTE PAGO' },
    { value: 'LLAMADA CONCILIACION', option: 'LLAMADA CONCILIACION' },
    { value: 'LLAMADA NO EFECTIVA', option: 'LLAMADA NO EFECTIVA' },
    { value: 'CIRCULAR CORREO', option: 'CIRCULAR CORREO' },
    { value: 'CIRCULAR FISICO', option: 'CIRCULAR FISICO' },
    { value: 'PREJURIDICO', option: 'PREJURIDICO' },
  ];
  public loadingTable: boolean = false;
  public myForm = new FormGroup({
    FECHA: GFecha,
    erp: GErp,
    nit: GNit,
    TELEFTERC: GContacto,
    RESPTERC: GResponsable,
    MOTLLAMAD: GVisitaCobro,
    OBSERVACION: GObservaciones,
    TIPCONCI: GTipoConciliacion,
    FECHCONCI: GFechaConciliacion,
  });
  get FECHA(): FormControl {
    return this.myForm.controls.FECHA as FormControl;
  }
  get erp(): FormControl {
    return this.myForm.controls.erp as FormControl;
  }
  get nit(): FormControl {
    return this.myForm.controls.nit as FormControl;
  }
  get TELEFTERC(): FormControl {
    return this.myForm.controls.TELEFTERC as FormControl;
  }
  get RESPTERC(): FormControl {
    return this.myForm.controls.RESPTERC as FormControl;
  }
  get MOTLLAMAD(): FormControl {
    return this.myForm.controls.MOTLLAMAD as FormControl;
  }
  get OBSERVACION(): FormControl {
    return this.myForm.controls.OBSERVACION as FormControl;
  }
  get TIPCONCI(): FormControl {
    return this.myForm.controls.TIPCONCI as FormControl;
  }
  get FECHCONCI(): FormControl {
    return this.myForm.controls.FECHCONCI as FormControl;
  }
  public loading: boolean = false;
  public fechaConciliacion: boolean = false;
  public create: boolean = false;
  public onCreateView: boolean = false;
  public resetBtn: boolean = false;
  public lastConsult: string = '';
  public OIDGENTERCER!: number;
  public OID!: number;
  public FECHACONCILIACION!: string;
  public textBtnForm!: string;
  public description!: string;
  public showGraphs: boolean = true;
  public canSeeGraphics: boolean = false;
  public showAllLlamadas: boolean = false;
  public llamadasTotalData: any;
  public llamadasUsuarioData: any;
  public llamadasPorUsuarioData: any;
  public showGraphs01: boolean = false;
  public showGraphs02: boolean = false;
  public inicioReporte: any = '';
  public finalReporte: any = '';
  public oldData: any;
  public isOldData: boolean = true;

  constructor(
    private _carteraStore: CarteraStore,
    private _cd: ChangeDetectorRef,
    private _toast: ToastService,
    private _store: StoreService,
    private _timer: TimerService,
    private _dialog: MatDialog,
    private _api: ApiService,
    private _jwt: JwtService
  ) {
    this.MOTLLAMAD.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (data === 'LLAMADA CONCILIACION') {
        this.fechaConciliacion = true;
      } else {
        this.fechaConciliacion = false;
      }
    });
  }

  public ngOnInit(): void {
    if (CARTERA_ADMINS.includes(this._jwt.decode()?.sub.idUsuario!)) {
      this.canSeeGraphics = true;
      this._cd.markForCheck();
    }
    this.MOTLLAMAD.setValue('VISITA SOPORTE PAGO');
    const decode: AuthTokenI = this._jwt.decode()!;
    this.userId = decode.sub.idUsuario;
    this.erp.disable();
    this.FECHA.disable();
    this._carteraStore.gestion$.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      if (!data.wasLoaded) {
        this.getInit();
      } else {
        this.oldData = data.dataSource;
        this.instanciarGraficas(data.dataSource);
        this._store.setDataSource(data.dataSource);
        this.lastConsult = data.lastUpdated.fromNow();
      }
    });
  }

  public onFilterByRange(): void {
    if (
      ['', null, undefined].indexOf(this.inicioReporte) >= 0 ||
      ['', null, undefined].indexOf(this.finalReporte) >= 0
    ) {
      this._toast.notification('Seleccione un rango de fecha valido');
    } else {
      const newArr: any = this.oldData.filter(
        (r: any) =>
          this._timer.getDate(r.FECHA) >= this._timer.getDate(this.inicioReporte) &&
          this._timer.getDate(r.FECHA) <= this._timer.getDate(this.finalReporte)
      );
      this._store.setDataSource(newArr);
      this.showGraphs01 = false;
      this.showGraphs02 = false;
      this._cd.markForCheck();
      setTimeout(() => {
        this.instanciarGraficas(newArr);
      }, 10);
      this.isOldData = false;
    }
  }

  public getOldData(): void {
    this._store.setDataSource(this.oldData);
    this.showGraphs01 = false;
    this.showGraphs02 = false;
    this._cd.markForCheck();
    setTimeout(() => {
      this.instanciarGraficas(this.oldData);
    }, 10);
    this.inicioReporte = '';
    this.finalReporte = '';
    this.isOldData = true;
  }

  public instanciarGraficas(data: any): void {
    let motLlamUsuario: any = [];
    let motLlamTotal: any = [];
    const motLlaWithObjUsuario: any = [];
    const motLlaWithObjTotal: any = [];
    let labels: any = [];
    let datas: any = [];
    let backgroundColors: any[] = [];
    // LLamadas Usuario
    const idAuthUser = this._jwt.decode()?.sub.idUsuario;
    const dataForUsuario = data.filter((r: any) => r.OIDGENUSUARIO === idAuthUser);
    dataForUsuario.map((r: any) => {
      motLlamUsuario.push(r.MOTLLAMAD);
    });
    motLlamUsuario = _.uniq(motLlamUsuario);
    motLlamUsuario.map((r: any) => {
      motLlaWithObjUsuario.push({ MOTLLAMAD: r, CANTIDAD: 0 });
    });
    dataForUsuario.map((r: any) => {
      motLlaWithObjUsuario.map((i: any) => {
        if (i.MOTLLAMAD === r.MOTLLAMAD) {
          i.CANTIDAD++;
        }
      });
    });
    motLlaWithObjUsuario.map((r: any) => {
      labels.push(r.MOTLLAMAD);
      datas.push(r.CANTIDAD);
    });
    datas.map((r: any) => {
      const col1 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col2 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col3 = Math.floor(Math.random() * (255 - 1)) + 1;
      backgroundColors.push(`rgb(${col1}, ${col2}, ${col3})`);
    });
    this.llamadasUsuarioData = {
      labels: labels,
      datasets: [
        {
          label: 'Llamadas del Usuario',
          data: datas,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          hoverBorderColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
    };
    if (datas.length > 0) {
      this.showGraphs02 = true;
    }
    // Llamadas totales
    data.map((r: any) => {
      motLlamTotal.push(r.MOTLLAMAD);
    });
    motLlamTotal = _.uniq(motLlamTotal);
    motLlamTotal.map((r: any) => {
      motLlaWithObjTotal.push({ MOTLLAMAD: r, CANTIDAD: 0 });
    });
    data.map((r: any) => {
      motLlaWithObjTotal.map((i: any) => {
        if (i.MOTLLAMAD === r.MOTLLAMAD) {
          i.CANTIDAD++;
        }
      });
    });
    labels = [];
    datas = [];
    motLlaWithObjTotal.map((r: any) => {
      labels.push(r.MOTLLAMAD);
      datas.push(r.CANTIDAD);
    });

    backgroundColors = [];
    datas.map((r: any) => {
      const col1 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col2 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col3 = Math.floor(Math.random() * (255 - 1)) + 1;
      backgroundColors.push(`rgb(${col1}, ${col2}, ${col3})`);
    });
    this.llamadasTotalData = {
      labels: labels,
      datasets: [
        {
          label: 'Llamadas Totales',
          data: datas,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          hoverBorderColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
    };
    if (datas.length > 0) {
      this.showGraphs01 = true;
    }
    //estadisticas de usuarios
    const users: any = [];
    data.map((r: any) => {
      let count: boolean = false;
      if (users.length === 0) {
        users.push({ ID: r.OIDGENUSUARIO, NOMBRE: r.GENUSUARIO });
      } else {
        users.map((i: any) => {
          if (i.ID === r.OIDGENUSUARIO) {
            count = true;
          }
        });
        if (!count) {
          users.push({ ID: r.OIDGENUSUARIO, NOMBRE: r.GENUSUARIO });
        }
      }
    });
    users.map((r: any) => {
      let llamadasTemp: any = [];
      let llamadas: any = [];
      data.map((i: any) => {
        if (i.OIDGENUSUARIO === r.ID) {
          llamadasTemp.push(i.MOTLLAMAD);
        }
      });
      llamadasTemp = _.uniq(llamadasTemp);
      llamadasTemp.map((i: string) => {
        llamadas.push({ MOTLLAMAD: i, CANTIDAD: 0 });
      });
      data.map((i: any) => {
        if (i.OIDGENUSUARIO === r.ID) {
          llamadas.map((j: any) => {
            if (i.MOTLLAMAD === j.MOTLLAMAD) {
              j.CANTIDAD++;
            }
          });
        }
      });
      r.LLAMADAS = llamadas;
    });
    this.llamadasPorUsuarioData = users;
    this._cd.markForCheck();
  }

  public update(): void {
    this.instanciarGraficas([]);
    this.showGraphs01 = false;
    this.showGraphs02 = false;
    this.loading = true;
    this.loadingTable = true;
    setTimeout(() => {
      this.getInit();
    }, 1000);
  }

  public getInit(): void {
    this.loading = true;
    this.loadingTable = true;
    const url = `cartera/gestion`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.oldData = res.data;
        this.instanciarGraficas(res.data);
        this.loading = false;
        this.lastConsult = this._timer.getDate().fromNow();
        this._carteraStore.setGestion(res.data, true);
        this.loadingTable = false;
      }
    });
  }

  public onChangeNit(): void {
    if (this.FECHA.value === null) {
      this.FECHA.setValue(new Date());
    }
    const url = `cartera/gestion/tercero/${this.nit.value}`;
    this._api.get(url).subscribe(res => {
      if (res.data[0]) {
        this.ERP = res.data[0];
        this.OIDGENTERCER = res.data[0].OID;
        this.erp.setValue(res.data[0].TERNOMCOM);
      } else {
        this.erp.reset();
        this.nit.reset();
        this._toast.notification('Este nit no existe');
      }
    });
  }

  public onSubmit(): void {
    if (this.create && [null, ''].indexOf(this.nit.value) >= 0) {
      this._toast.notification('Debe introducir un NIT');
    } else if (this.fechaConciliacion && this.FECHCONCI.value === null) {
      this._toast.notification('Debe elegir una fecha de conciliación valida');
    } else if (
      this.fechaConciliacion &&
      !this._timer.OlderThanToday(this.FECHCONCI.value)
    ) {
      this._toast.notification(
        'Debe elegir una fecha de conciliación superior o igual a hoy'
      );
    } else {
      if (!this.fechaConciliacion) {
        this.FECHCONCI.setValue(null);
      }
      const body: any = this.myForm.value;
      body.FECHA = this._timer.formatDate(this.FECHA.value);
      if (this.fechaConciliacion) {
        body.FECHCONCI = this._timer.formatDate(this.FECHCONCI.value);
      }
      body.GENTERCER = this.ERP.OID;
      body.GENUSUARIO = this.userId;
      delete body.nit;
      body.OBSERVACION = body.OBSERVACION.toUpperCase();
      body.RESPTERC = body.RESPTERC.toUpperCase();
      const url = `cartera/gestion`;
      this._api.post(body, url).subscribe(res => {
        if (res.success) {
          this._toast.notification(res.message);
          this.onCreateView = false;
          this.loading = true;
          this.myForm.reset();
          this.FECHA.setValue(new Date());
          setTimeout(() => {
            this.getInit();
          }, 1000);
        } else {
          this._toast.notification(res.message);
        }
        this._cd.markForCheck();
      });
    }
  }

  public onCreate(): void {
    this.create = true;
    this.textBtnForm = 'CREAR';
    this.description = 'Nuevo registro';
    this.myForm.reset();
    this.FECHA.setValue(new Date());
    this.resetBtn = true;
    this.onCreateView = true;
  }

  public onSelectRow(row: GestionI): void {
    const dialog = this._dialog.open(GestionDialog, {
      width: '80vw',
      maxWidth: '600px',
      data: row,
    });

    dialog.afterClosed().subscribe(data => {
      if (data) {
        if (data.selection === 'delete') {
          if (data.deleted) {
            this.update();
          }
        }
        if (data.selection === 'edit') {
          this.resetBtn = false;
          this.create = false;
          this.textBtnForm = 'ACTUALIZAR';
          this.description = 'Actualización de registro';
          this.myForm.reset();
          this.FECHA.setValue(new Date());
          const dt: { selection: string; row: GestionI } = data;
          this.FECHA.setValue(dt.row.FECHA);
          this.erp.setValue(dt.row.GENTERCER);
          this.TELEFTERC.setValue(dt.row.TELEFTERC);
          this.RESPTERC.setValue(dt.row.RESPTERC);
          this.MOTLLAMAD.setValue(dt.row.MOTLLAMAD);
          this.OBSERVACION.setValue(dt.row.OBSERVACION);
          this.TIPCONCI.setValue(dt.row.TIPCONCI);
          this.FECHCONCI.setValue(dt.row.FECHCONCI);
          this.OIDGENTERCER = dt.row.OIDGENTERCER;
          this.OID = dt.row.OID;
          this.FECHACONCILIACION = dt.row.FECHCONCI;
          this.onCreateView = true;
          this._cd.markForCheck();
        }
      }
    });
  }

  public onUpdateGestion(): void {
    if (
      this.FECHCONCI.value !== null &&
      this.FECHACONCILIACION !== this.FECHCONCI.value &&
      !this._timer.OlderThanToday(this.FECHCONCI.value)
    ) {
      this._toast.notification(
        'Debe elegir una fecha de conciliación superior o igual a hoy'
      );
    } else {
      const body: any = this.myForm.value;
      body.FECHA = this._timer.formatDate(this.FECHA.value);
      if (this.fechaConciliacion) {
        body.FECHCONCI = this._timer.formatDate(this.FECHCONCI.value);
      }
      body.GENTERCER = this.OIDGENTERCER;
      body.GENUSUARIO = this.userId;
      delete body.nit;
      body.OBSERVACION = body.OBSERVACION.toUpperCase();
      body.RESPTERC = body.RESPTERC.toUpperCase();
      const url = `cartera/gestion/${this.OID}`;
      this._api.put(body, url).subscribe(res => {
        if (res.success) {
          this._toast.notification('Gestión actualizada correctamente');
          this.onCreateView = false;
          this.loading = true;
          this.loadingTable = true;

          this.FECHA.setValue(new Date());
          setTimeout(() => {
            this.getInit();
          }, 1000);
        } else {
          this.onCreateView = false;
        }
        this._cd.markForCheck();
      });
    }
  }

  public backToTable(): void {
    this.onCreateView = false;
  }

  public onShowGraphs(): void {
    if (this.showGraphs) {
      this.showGraphs = false;
    } else {
      this.showGraphs = true;
    }
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
/* detalles gestion */
@Component({
  selector: 'gestion-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./gestion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionDialog implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public canDelete: boolean = false;

  constructor(
    private _modal: ModalService,
    private _toast: ToastService,
    private _jwt: JwtService,
    public _dialogRef: MatDialogRef<GestionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GestionI,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    if (CARTERA_ADMINS.includes(this._jwt.decode()?.sub.idUsuario!)) {
      this.canDelete = true;
    }
  }

  public onEdit() {
    this._dialogRef.close({ selection: 'edit', row: this.data });
  }

  public onDelete() {
    this._modal
      .confirm('¿Desea eliminar esta gestión de la base de datos?', 'Seguro(a)?')
      .subscribe(async data => {
        if (data) {
          const url = `cartera/gestion/${this.data.OID}`;
          this._api.delete(url).subscribe(res => {
            if (res.success) {
              this._toast.notification('Gestión eliminada correctamente');
              this._dialogRef.close({ selection: 'delete', deleted: true });
            } else {
              this._toast.notification(res.message);
              this._dialogRef.close({ selection: 'delete', deleted: false });
            }
          });
        }
      });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
