import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/application/services/api.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { RSIngreso } from '../radicacion.forms';
import { RadicacionStore } from '../radicacion.store';

@Component({
  selector: 'app-reporte-sabanas',
  templateUrl: './reporte-sabanas.component.html',
  styleUrls: ['./reporte-sabanas.component.scss'],
})
export class ReporteSabanas implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  displayedColumns: any = ['HCACODIGO', 'HCANOMBRE', 'HESFECING', 'HESFECSAL'];
  columnsNames: any = ['Subgrupo', 'Cama', 'Fecha Inicio', 'Fecha Final'];
  dataSource: any = new MatTableDataSource<any>([]);
  dataValues: any = [];
  searchKey: any;
  context: any;

  loading: boolean = false;
  onConsult: boolean = false;
  Form = new FormGroup({
    ingreso: RSIngreso,
  });

  inicioReporte: any = '';
  finalReporte: any = '';
  statusReporte: string = 'No hay reportes pendientes';
  generandoReporte: boolean = false;
  disableGenerarReporteBtn: boolean = false;
  data: any;

  constructor(
    private _radicacionStore: RadicacionStore,
    private cd: ChangeDetectorRef,
    private _timer: TimerService,
    private toast: ToastService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this._radicacionStore.statusReporte$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(status => {
        this.statusReporte = status;
        if (status === 'No hay reportes pendientes') {
          this.generandoReporte = false;
          this.disableGenerarReporteBtn = false;
        }
        this.cd.markForCheck();
      });
  }

  onSubmit(): void {
    this.loading = true;
    this.api.get(`uci-sheets/Estancia?Ingreso=${this.ingreso.value}`).subscribe(res => {
      if (res.success) {
        if (res.data.length > 0) {
          this.loading = false;
          this.dataSource = new MatTableDataSource<any>(res.data);
          this.dataSource.paginator = this.paginator;
          this.onConsult = true;
        } else {
          this.loading = false;
          this.toast.notification('no se encontraron estancias para este paciente');
        }
        this.cd.markForCheck();
      } else {
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  generarReporte() {
    if (this.inicioReporte === '' || this.finalReporte === '') {
      this.toast.notification('usted debe elegir un rango de fecha valido');
    } else {
      this.disableGenerarReporteBtn = true;
      this.statusReporte = 'Obteniendo datos';
      const url = `uci-sheets/datas?Ingreso=${
        this.ingreso.value
      }&fechaInicio=${this._timer.formatDate(
        this.inicioReporte
      )}&fechaFinal=${this._timer.formatDate(this.finalReporte)}`;
      this.api.get(url).subscribe(res => {
        if (res.success) {
          this.data = res.data;
          this.generandoReporte = true;
          this.cd.markForCheck();
        } else {
          this.disableGenerarReporteBtn = false;
          this.cd.markForCheck();
        }
      });
    }
  }

  backToConsult() {
    this.onConsult = false;
  }
  applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  get ingreso(): FormControl {
    return this.Form.controls['ingreso'] as FormControl;
  }
}
