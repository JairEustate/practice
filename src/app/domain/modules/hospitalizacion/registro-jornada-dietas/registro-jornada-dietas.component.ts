import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { RegistroJornadaDietasService } from './registro-jornada-dietas.services';
import { StoreService } from 'src/app/application/services/store.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ApiService } from 'src/app/application/services/api.service';
import { ResponseI } from 'src/app/application/interfaces/response.interface';
import { SubgrupoCamaI } from './registro-jornada-dietas.interfaces';
import { HospitalizacionStore } from '../hospitalizacion.store';
import {
  RJDCentro,
  RJDFecha,
  RJDJornada_dieta,
  RJDSubgrupo_cama,
} from '../hospitalizacion.forms';

@Component({
  selector: 'app-registro-jornada-dietas',
  templateUrl: './registro-jornada-dietas.component.html',
  styleUrls: ['./registro-jornada-dietas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroJornadaDietas implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading: boolean = false;
  updating: boolean = false;
  onConsult: boolean = false;
  lastUpdatedTable: any;
  loadingTable: boolean = false;
  displayedColumns: any = ['CAMA', 'GPANOMPAC', 'DIEGRUTIP', 'DIEGRUCON', 'GMENOMCOM'];
  columnNames: any = ['Cama', 'Paciente', 'Tipo', 'Consistencia', 'Medico de Evolución'];

  myForm = new FormGroup({
    centro: RJDCentro,
    fecha: RJDFecha,
    jornada_dieta: RJDJornada_dieta,
    subgrupo_cama: RJDSubgrupo_cama,
  });
  subgrupo_camaHSUCODIGO: string = '';
  subgrupo_camaHSUNOMBRE: string = '';
  centroAtencion: string = '';
  jornada: string = '';
  subgrupo: string = '';

  centrosArray: any = [];
  subgruposArray: any = [];
  subgruposArrayFiltered: any = [];
  jornadasArray: any = [
    { value: '1', option: 'DESAYUNO' },
    { value: '2', option: 'ALMUERZO' },
    { value: '3', option: 'CENA' },
  ];

  data: any;

  constructor(
    private _hospitalizacionStore: HospitalizacionStore,
    private _svc: RegistroJornadaDietasService,
    private _cd: ChangeDetectorRef,
    private _store: StoreService,
    private _toast: ToastService,
    private _modal: ModalService,
    private _dialog: MatDialog,
    private _timer: TimerService,
    private _api: ApiService,
    private _router: Router
  ) {
    this.centro.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getSubgrupos();
    });
  }

  ngOnInit(): void {
    this.fecha.setValue(new Date());
    this.fecha.disable();
    // Verificar si se consultaron los centros anteriormente
    this._store.centroAtencion$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (!data.wasLoaded) {
        this.getCentros();
      } else {
        this.centrosArray = data.centros;
        if (this.centro.value === '') {
          this.centro.setValue(data.centros[0].id);
        }
      }
    });
    // Verificar si se consultaron los subgrupos anteriormente
    this._hospitalizacionStore.subgrupos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (data.wasLoaded) {
          this.subgruposArray = data.subgrupos;
        }
      });
  }

  getCentros(): void {
    this._api.get('center-of-attention').subscribe(res => {
      if (res.success) {
        this.centrosArray = res.data;
        this._store.setCentroAtencion({
          wasLoaded: true,
          centros: res.data,
        });
        if (this.centro.value === '') {
          this.centro.setValue(res.data[0].id);
        }
      }
    });
  }

  getSubgrupos(): void {
    this.subgruposArray = [];
    this.subgrupo_cama.setValue('');
    this._api.get(`subgroup?center=${this.centro.value}`).subscribe(res => {
      let dataResponse: ResponseI = res;
      if (dataResponse.success) {
        dataResponse.data.map((r: SubgrupoCamaI) =>
          this.subgruposArray.push({
            OID: r.OID,
            HSUCODIGO: r.HSUCODIGO,
            NAME: `${r.HSUCODIGO} ${r.HSUNOMBRE}`,
          })
        );
        this._hospitalizacionStore.setSubgrupos(
          this.centro.value,
          this.subgruposArray,
          true
        );
      }
    });
  }
  /**
   * Dependiendo del tipo de evento:
   * 'keyup': retorna los items que incluyan el valor de 'subgrupo_cama'
   * 'selected': almacena en otra variable el HSUCODIGO recibido
   * @param evento
   * @param HSUCODIGO
   */
  filtrarSubgrupos(evento: string, HSUCODIGO: string = ''): void {
    if (evento === 'keyup') {
      this.subgruposArrayFiltered = [];
      if (this.subgrupo_cama.value !== '') {
        this.subgruposArrayFiltered = this._svc.filtrarSubgrupos(
          this.subgrupo_cama.value,
          this.subgruposArray
        );
      }
    } else {
      if (this.subgrupo_cama.value === '') {
        this.subgruposArrayFiltered = [];
      }
    }
    if (evento === 'selected') {
      if (HSUCODIGO === null) {
        this.subgrupo_cama.setValue('');
        this.subgrupo_camaHSUCODIGO = '';
      } else {
        this.subgrupo_camaHSUCODIGO = HSUCODIGO;
      }
    }
  }

  clearSubgrupoCama(): void {
    this.subgrupo_cama.setValue('');
    this.subgrupo_camaHSUNOMBRE = '';
    this.subgrupo_camaHSUCODIGO = '';
  }

  onSubmit(): void {
    this.loading = true;
    //Asignando valores a mostrar en el header de la tabla
    this.subgrupo_camaHSUNOMBRE =
      this.subgrupo_cama.value > 55
        ? this.subgrupo_cama.value.substring(0, 55) + '...'
        : this.subgrupo_cama.value;
    this.subgrupo_camaHSUNOMBRE = this.subgrupo_cama.value;
    this.centroAtencion = this.centrosArray.filter(
      (element: { id: string }) => element.id === this.centro.value
    )[0].centroAtencion;
    this.subgrupo = this.subgruposArray.find(
      (el: { HSUCODIGO: string }) => el.HSUCODIGO === this.subgrupo_camaHSUCODIGO
    )?.OID;
    if (this.jornada_dieta.value === '1') {
      this.jornada = 'DESAYUNO';
    } else {
      this.jornada = this.jornada_dieta.value === '2' ? 'ALMUERZO' : 'CENA';
    }
    //Obteniendo pacientes
    this.getPacientes();
  }

  onUpdate(): void {
    this.loadingTable = true;
    this.getPacientes();
  }

  getPacientes(): void {
    const url = `diet-patients?center=${this.centro.value}&subgroup=${[
      this.subgrupo_camaHSUCODIGO,
    ]}`;
    this._api.get(url).subscribe({
      next: res => {
        if (res.success) {
          if (res.data.length > 0) {
            if (!this.onConsult) {
              this._store.setDataSource(res.data);
              this.onConsult = true;
            } else {
              setTimeout(() => {
                this._store.setDataSource(res.data);
                this.loadingTable = false;
              }, 1000);
            }
          } else {
            this._toast.notification(
              'no hay pacientes por asignar dieta en este subgrupo'
            );
          }
        } else {
          this._toast.notification(res.message);
        }
        this.loading = false;
        this._cd.markForCheck();
      },
    });
  }
  backToForm(): void {
    this.onConsult = false;
  }
  onSelectRow(event: any): void {
    const dialogRef = this._dialog.open(RegistroJornadaDietasEditor, {
      data: {
        paciente: event,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this._cd.detectChanges();
    });
  }
  onSendTable(event: any) {
    this._modal
      .confirm(
        `deseas enviar ${this._svc.getPacientesToSend(event).length} de ${
          event.length
        } pacientes?`,
        'Advertencia'
      )
      .subscribe(result => {
        if (result) {
          const jornadaId = this.jornadasArray.filter(
            (r: any) => r.option === this.jornada
          )[0].value;
          const body = {
            fechaDieta: this._timer.formatDate(),
            dietaJornada: parseInt(jornadaId),
            adncenate: this.centro.value,
            subgroup: this.subgrupo,
            pacientes: this._svc.getPacientesToSend(event),
          };
          this.sending(body);
        }
      });
  }
  sending(body: any) {
    this._api.post(body, 'diet-patients').subscribe(res => {
      if (res.success) {
        setTimeout(() => {
          this._router.navigate(['hospitalizacion/jornada-dietas']);
        }, 1000);
      }
    });
  }
  ngOnDestroy(): void {
    this.subgrupo_cama.reset();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  get centro(): FormControl {
    return this.myForm.controls['centro'] as FormControl;
  }
  get fecha(): FormControl {
    return this.myForm.controls['fecha'] as FormControl;
  }
  get jornada_dieta(): FormControl {
    return this.myForm.controls['jornada_dieta'] as FormControl;
  }
  get subgrupo_cama(): FormControl {
    return this.myForm.controls['subgrupo_cama'] as FormControl;
  }
}
/** ---------------------------------------------------------------------------
 ---------------------------------------------------------------------------- */
@Component({
  selector: 'registro-jornada-dietas-editor',
  templateUrl: './editor.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroJornadaDietasEditor {
  constructor(
    public dialogRef: MatDialogRef<RegistroJornadaDietasEditor>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  DIEGRUTIPLista: string[] = [
    'NO APLICA',
    'NADA VIA ORAL',
    'HIPOSODICA',
    'HIPOGLUCIDA',
    'HIPERPROTEICA',
    'HIPOGRASA',
    'HEPATOPROTEICA',
    'ABACTERIANA',
    'INMUNOSUPRIMIDA',
    'GASTROPROTECTORA',
    'NEFROPROTECTORA',
    'ASTRINGENTE',
    'COROLIOPROTETURA',
    'ANTICOAGULANTE',
    'CORRIENTE',
  ];

  paciente: any = [this.data.paciente];
  DIEGRUTIP = new FormControl([]);
  DIEGRUCON: any = this.data.paciente.DIEGRUCON;

  onNoClick(): void {
    this.dialogRef.close();
  }

  edit() {
    let DIEGRUTIP_CONCATENADO = '';
    if (this.DIEGRUTIP.value!.length > 0) {
      this.DIEGRUTIP.value!.map((dato: any) => {
        DIEGRUTIP_CONCATENADO = `${DIEGRUTIP_CONCATENADO} ${dato}`;
      });
    }
    this.paciente.map((dato: any) => {
      if (this.DIEGRUTIP.value!.length > 0) {
        dato.DIEGRUTIP =
          this.DIEGRUTIP.value!.toString() === '' ? null : DIEGRUTIP_CONCATENADO;
      }
      dato.DIEGRUCON = this.DIEGRUCON === '' ? null : this.DIEGRUCON;
    });
    this.dialogRef.close();
  }
}
