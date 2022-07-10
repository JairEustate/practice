import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  CFechaConciliacion,
  CIdGestion,
  CNActaConciliacion,
  CValorConciliado,
  CValorReconocidoParaPago,
  CValorGlosado,
  CValorDevuelto,
  CValorNoRadicado,
  CValorEnAuditoria,
  CValorEnRetencion,
  CValorDeGlosasAceptadaPorIPS,
  CValorNoDescontadoPorEps,
  CValorPagoNoAplicado,
  CValorCuotaModeradora,
  CValorCancelado,
  CEstado,
} from '../cartera.forms';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { ConciliacionI } from './conciliacion.interfaces';
import { StoreService } from 'src/app/application/services/store.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { GroupService } from 'src/app/application/services/group.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ApiService } from 'src/app/application/services/api.service';
import { GroupI } from 'src/app/application/interfaces/group.interface';
import * as _ from 'lodash';
import { JwtService } from 'src/app/application/services/jwt.service';
import { CarteraStore } from '../cartera.store';
import { CARTERA_ADMINS } from '../cartera.admin';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conciliacion implements OnInit {
  private _unsubscribe$ = new Subject<void>();
  public displayedColumns: string[] = [
    'IdConciliacion',
    'IdGestion',
    'FechaConciliacion',
    'FechaGestion',
    'Tercero',
    'Dias',
    'Estado',
    'RutaArchivo',
  ];
  public columnNames: string[] = [
    'Cod.',
    'Cod. Gestión',
    'Fecha Concil.',
    'Fecha Gestión',
    'ERP',
    'Días',
    'Estado',
    'Archivo',
  ];
  myForm = new FormGroup({
    FECHACONC: CFechaConciliacion,
    GCMGESCAR: CIdGestion,
    NACTACONCI: CNActaConciliacion,
    VALCONCI: CValorConciliado,
    VALRECPAG: CValorReconocidoParaPago,
    VALGLOSAD: CValorGlosado,
    VALDEVUEL: CValorDevuelto,
    VALNORADI: CValorNoRadicado,
    AUDITORIA: CValorEnAuditoria,
    RETENCION: CValorEnRetencion,
    GLOSACEPTIPS: CValorDeGlosasAceptadaPorIPS,
    NOTNODESCEPS: CValorNoDescontadoPorEps,
    PAGNOAPLI: CValorPagoNoAplicado,
    COPCUOMODE: CValorCuotaModeradora,
    VALCANCEL: CValorCancelado,
    ESTADO: CEstado,
  });
  get FECHACONC(): FormControl {
    return this.myForm.controls.FECHACONC as FormControl;
  }
  get GCMGESCAR(): FormControl {
    return this.myForm.controls.GCMGESCAR as FormControl;
  }
  get NACTACONCI(): FormControl {
    return this.myForm.controls.NACTACONCI as FormControl;
  }
  get VALCONCI(): FormControl {
    return this.myForm.controls.VALCONCI as FormControl;
  }
  get VALRECPAG(): FormControl {
    return this.myForm.controls.VALRECPAG as FormControl;
  }
  get VALGLOSAD(): FormControl {
    return this.myForm.controls.VALGLOSAD as FormControl;
  }
  get VALDEVUEL(): FormControl {
    return this.myForm.controls.VALDEVUEL as FormControl;
  }
  get VALNORADI(): FormControl {
    return this.myForm.controls.VALNORADI as FormControl;
  }
  get AUDITORIA(): FormControl {
    return this.myForm.controls.AUDITORIA as FormControl;
  }
  get RETENCION(): FormControl {
    return this.myForm.controls.RETENCION as FormControl;
  }
  get GLOSACEPTIPS(): FormControl {
    return this.myForm.controls.GLOSACEPTIPS as FormControl;
  }
  get NOTNODESCEPS(): FormControl {
    return this.myForm.controls.NOTNODESCEPS as FormControl;
  }
  get PAGNOAPLI(): FormControl {
    return this.myForm.controls.PAGNOAPLI as FormControl;
  }
  get COPCUOMODE(): FormControl {
    return this.myForm.controls.COPCUOMODE as FormControl;
  }
  get VALCANCEL(): FormControl {
    return this.myForm.controls.VALCANCEL as FormControl;
  }
  get ESTADO(): FormControl {
    return this.myForm.controls.ESTADO as FormControl;
  }
  public IDCONCI!: number;
  public lastConsult: string = '';
  public loading: boolean = false;
  public onEditView: boolean = false;
  public FILEPDF: any = null;
  public hasPdfPrevious: boolean = false;
  public PdfRoute!: string;
  public pdfName: string = 'Subir PDF';
  public openModal: boolean = true;
  public URLPublic: string = environment.API_URL;
  public inicioReporte: any = '';
  public finalReporte: any = '';
  public oldData: any;
  public isOldData: boolean = true;
  public showGraphs: boolean = true;
  public canSeeGraphics: boolean = false;
  public Graphs01Data: any;
  public Graphs02Data: any;
  public showGraphs01: boolean = false;
  public showGraphs02: boolean = false;
  public cards: any;

  constructor(
    private _carteraStore: CarteraStore,
    private _api: ApiService,
    private _dialog: MatDialog,
    private _cd: ChangeDetectorRef,
    private _toast: ToastService,
    private _store: StoreService,
    private _timer: TimerService,
    private _group: GroupService,
    private _jwt: JwtService
  ) {}

  ngOnInit() {
    if (CARTERA_ADMINS.includes(this._jwt.decode()?.sub.idUsuario!)) {
      this.canSeeGraphics = true;
      this._cd.markForCheck();
    }
    this._carteraStore.conciliacion$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(data => {
        if (!data.wasLoaded) {
          this.getConciliaciones();
        } else {
          this.oldData = data.dataSource;
          this.instanciarGraficas(data.dataSource);
          this._store.setDataSource(data.dataSource);
          this.lastConsult = data.lastUpdated.fromNow();
        }
      });
  }
  onShowGraphs() {
    if (this.showGraphs) {
      this.showGraphs = false;
    } else {
      this.showGraphs = true;
    }
  }
  instanciarGraficas(data: any) {
    let labels: any = [];
    let datas: any = [];
    let backgroundColors: any = [];
    const AgrupByTercero: GroupI[] = this._group.groupByCommonId(
      data,
      'IdTercero',
      'Tercero'
    );
    // Conciliaciones por ERP
    AgrupByTercero.map((r: any) => {
      labels.push(r.NAME);
      datas.push(r.ROWS.length);
      const col1 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col2 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col3 = Math.floor(Math.random() * (255 - 1)) + 1;
      backgroundColors.push(`rgb(${col1}, ${col2}, ${col3})`);
    });
    this.Graphs01Data = {
      labels: labels,
      datasets: [
        {
          label: 'Conciliaciones por ERP',
          data: datas,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          hoverBorderColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
    };
    this.showGraphs01 = true;
    const AgrupByUser = this._group.groupByCommonId(
      data,
      'IdUsuario',
      'UsuarioEncargado'
    );
    // Conciliaciones por Usuario
    labels = [];
    datas = [];
    backgroundColors = [];
    AgrupByUser.map((r: any) => {
      r.ROWSAGROUPED = this._group.groupByCommonId(r.ROWS, 'IdTercero', 'Tercero');
      labels.push(r.NAME);
      datas.push(r.ROWS.length);
      const col1 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col2 = Math.floor(Math.random() * (255 - 1)) + 1;
      const col3 = Math.floor(Math.random() * (255 - 1)) + 1;
      r.color = `rgb(${col1}, ${col2}, ${col3})`;
      backgroundColors.push(`rgb(${col1}, ${col2}, ${col3})`);
    });
    this.Graphs02Data = {
      labels: labels,
      datasets: [
        {
          label: 'Conciliaciones por Usuario',
          data: datas,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          hoverBorderColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
    };
    this.showGraphs02 = true;
    this.cards = AgrupByUser;
    this._cd.markForCheck();
  }

  update() {
    this.instanciarGraficas([]);
    this.showGraphs01 = false;
    this.showGraphs02 = false;
    this.loading = true;
    setTimeout(() => {
      this.getConciliaciones();
    }, 1000);
  }
  getConciliaciones() {
    const url = `cartera/conciliacion`;
    this._api.get(url).subscribe(res => {
      this._carteraStore.setConciliacion(res.data, true);
      this.oldData = res.data;
      this.instanciarGraficas(res.data);
      this._store.setDataSource(res.data);
      this.loading = false;
    });
  }
  onFilterByRange() {
    if (
      ['', null, undefined].indexOf(this.inicioReporte) >= 0 ||
      ['', null, undefined].indexOf(this.finalReporte) >= 0
    ) {
      this._toast.notification('Seleccione un rango de fecha valido');
    } else {
      const newArr: any = this.oldData.filter(
        (r: any) =>
          this._timer.getDate(r.FechaConciliacion) >=
            this._timer.getDate(this.inicioReporte) &&
          this._timer.getDate(r.FechaConciliacion) <=
            this._timer.getDate(this.finalReporte)
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
  getOldData() {
    this._store.setDataSource(this.oldData);
    this.showGraphs01 = false;
    this.showGraphs02 = false;
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
  uploadFile(event: any) {
    if (event.target.files[0] === undefined) {
      this.FILEPDF = null;
      this.pdfName = 'Subir PDF';
    } else {
      if (event.target.files[0].type === 'application/pdf') {
        if (event.target.files[0].size < 5120000) {
          this.FILEPDF = event.target.files[0];
          let name = event.target.files[0].name.split('.pdf')[0];
          name = name.split('.PDF');
          if (name[0].length > 10) {
            name = name[0].slice(0, 9) + '..';
          }
          this.pdfName = `${name}.pdf`;
        } else {
          this._toast.notification('Este archivo es demasiado grande');
          this.pdfName = 'Subir PDF';
        }
      } else {
        this.FILEPDF = null;
        this._toast.notification('Este archivo no es de tipo PDF');
        this.pdfName = 'Subir PDF';
      }
    }
  }
  onUpdate() {
    if (this.FILEPDF === null && this.hasPdfPrevious === false) {
      this._toast.notification(
        'Usted debe subir un soporte de tipo .pdf para esta conciliación'
      );
    } else {
      const form: any = this.myForm.value;
      form.FECHACONC = this._timer.formatDate(this.FECHACONC.value);
      const array = [];
      const keys = Object.keys(form);
      for (let i = 0; i < keys.length; i++) {
        array.push({ name: keys[i], value: form[keys[i]] });
      }
      array.map((r: { name: string; value: any }) => {
        if (['ESTADO', 'FECHACONC', 'NACTACONCI'].indexOf(r.name) < 0) {
          if (`${r.value}`.includes('.')) {
            r.value = parseFloat(
              r.value.toString().replace(/,/g, '').replace(/ /g, '').replace('$', '')
            );
          } else {
            r.value = parseInt(
              r.value.toString().replace(/,/g, '').replace(/ /g, '').replace('$', '')
            );
          }
        }
      });
      const newForm: any = {};
      array.map((r: { name: string; value: any }) => {
        newForm[r.name] = r.value;
      });

      let formData = new FormData();
      formData.append('file', this.FILEPDF);
      const url = `cartera/conciliacion/${this.IDCONCI}`;
      const url2 = `cartera/conciliacion/acta/${this.IDCONCI}`;
      this._api.put(newForm, url).subscribe(async res => {
        if (res.success) {
          if (this.FILEPDF !== null) {
            this._api.put(formData, url2).subscribe(res => {
              if (res.success) {
                this.onEditView = false;
                this.loading = true;
                setTimeout(() => {
                  this.getConciliaciones();
                  this._toast.notification('Conciliación actualizada correctamente');
                  this._cd.markForCheck();
                }, 1000);
              }
            });
          } else {
            this.onEditView = false;
            this.loading = true;
            setTimeout(() => {
              this.getConciliaciones();
              this._toast.notification('Conciliación actualizada correctamente');
              this._cd.markForCheck();
            }, 1000);
          }
          this.myForm.reset();
          this.FILEPDF = null;
          this.pdfName = 'Subir PDF';
        }
      });
    }
  }
  openInfo(open: boolean) {
    if (open) {
      this.openModal = true;
    } else {
      this.openModal = false;
    }
  }
  backToTable() {
    this.onEditView = false;
  }
  onSelectRow(row: ConciliacionI) {
    if (this.openModal) {
      setTimeout(() => {
        const dialog = this._dialog.open(ConciliacionDialog, {
          height: '90vh',
          maxHeight: '650px',
          width: '80vw',
          maxWidth: '600px',
          data: { row, type: true },
        });
        dialog.afterClosed().subscribe(data => {
          if (data) {
            if (data.selection === 'delete') {
              this.update();
            }
            if (data.selection === 'edit') {
              this.FILEPDF = null;
              this.FECHACONC.disable();
              const row: ConciliacionI = data.row;
              if (row.RutaArchivo !== null) {
                this.hasPdfPrevious = true;
                this.PdfRoute = row.RutaArchivo;
              } else {
                this.hasPdfPrevious = false;
              }
              this.IDCONCI = row.IdConciliacion;
              this.FECHACONC.setValue(row.FechaConciliacion);
              this.NACTACONCI.setValue(row.NActaConciliacion);
              this.GCMGESCAR.setValue(row.IdGestion);
              this.VALCONCI.setValue(row.ValorConciliado);
              this.VALRECPAG.setValue(row.ValorReconocidoParaPago);
              this.VALGLOSAD.setValue(row.ValorGlosado);
              this.VALDEVUEL.setValue(row.ValorDevuelto);
              this.VALNORADI.setValue(row.ValorNoRadicado);
              this.AUDITORIA.setValue(row.ValorEnAuditoria);
              this.RETENCION.setValue(row.ValorEnRetencion);
              this.GLOSACEPTIPS.setValue(row.ValorDeGlosasAceptadaPorIPS);
              this.NOTNODESCEPS.setValue(row.ValorNoDescontadoPorEps);
              this.PAGNOAPLI.setValue(row.ValorPagoNoAplicado);
              this.COPCUOMODE.setValue(row.ValorCuotaModeradora);
              this.VALCANCEL.setValue(row.ValorCancelado);
              this.ESTADO.setValue(row.Estado);
              this.onEditView = true;
              this._cd.markForCheck();
            }
          }
        });
      }, 100);
    }
  }
  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

/* detalles conciliacion */
@Component({
  selector: 'conciliacion-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./conciliacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDialog implements OnDestroy, OnInit {
  private unsubscribe$ = new Subject<void>();
  canDelete: boolean = false;
  constructor(
    public _dialogRef: MatDialogRef<ConciliacionDialog>,
    private _api: ApiService,
    private _modal: ModalService,
    private _toast: ToastService,
    private _jwt: JwtService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    if (CARTERA_ADMINS.includes(this._jwt.decode()?.sub.idUsuario!)) {
      this.canDelete = true;
    }
  }

  onEdit() {
    this._dialogRef.close({ selection: 'edit', row: this.data.row });
  }
  onDelete() {
    this._modal
      .confirm('¿Desea eliminar esta conciliación de la base de datos?', 'Seguro(a)?')
      .subscribe(async data => {
        if (data) {
          const url = `cartera/conciliacion/${this.data.row.IdConciliacion}`;
          this._api.delete(url).subscribe(res => {
            if (res.success) {
              this._toast.notification('Conciliación eliminada correctamente');
              this._dialogRef.close({ selection: 'delete', deleted: true });
            } else {
              this._toast.notification(res.message);
              this._dialogRef.close({ selection: 'delete', deleted: false });
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
