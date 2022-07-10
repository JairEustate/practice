import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/application/services/api.service';
import { ExcelService } from 'src/app/application/services/excel.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { ToastService } from 'src/app/application/services/toast.service';

@Component({
  selector: 'estadistico-radicacion-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoRadicacionDialog implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  public rowWidthsInPx: number[] = [];
  dataSource: any = [];
  respaldo: any;
  oldDatasource: any = this.data.data;
  description: string = this.data.description;
  displayedColumns: any;
  oldDisplayedColumns: any;
  onConsult: boolean = false;
  canBeSelect: boolean = false;
  key: number = this.data.key;
  Form = new FormGroup({
    year: new FormControl('', [Validators.required]),
    month: new FormControl('', [Validators.required]),
  });
  filtered = new FormControl('');
  Eps: any;
  EpsFiltered: any;
  spin: any;
  timeLeft: any;
  flag: any;
  interval: any;
  columnsNames!: any;
  filter: any = '';
  constructor(
    private api: ApiService,
    private _timer: TimerService,
    public dialogRef: MatDialogRef<EstadisticoRadicacionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private excel: ExcelService,
    private toast: ToastService
  ) {
    if (this.data.key === 6) {
      this.Form.controls['year'].valueChanges.subscribe(() => {
        this.onChangeValue();
      });
      this.Form.controls['month'].valueChanges.subscribe(() => {
        this.onChangeValue();
      });
    }
  }
  ngOnInit(): void {
    if (this.data.rowWidthsInPx) {
      this.rowWidthsInPx = this.data.rowWidthsInPx;
    }
    if (this.data.key === 3) {
      this.canBeSelect = true;
    }
    if (this.data.key !== 6) {
      this.columnsNames = [
        'Nombre',
        'Can.',
        'Rad.',
        'Anu.',
        'Facturado',
        'Radicable',
        'Radicado',
        '%',
      ];
      this.displayedColumns = this.data.displayedColumns;
      this.oldDisplayedColumns = this.data.displayedColumns;
      this.instanciarTabla(this.data.data);
    } else {
      this.displayedColumns = [
        'SFANUMFAC',
        'SFAFECFAC',
        'TERNOMCOM',
        'GDENOMBRE',
        'SFATOTFAC',
      ];
      this.columnsNames = ['Factura', 'Fecha', 'Eps', 'Contrato', 'Total'];
      this.instanciarTabla(this.data.data);
    }
  }

  filtrar() {
    const filt: any = [];
    this.Eps.map((r: string) => {
      if (r.includes(this.filtered.value!.toUpperCase())) {
        filt.push(r);
      }
    });
    this.EpsFiltered = filt;
  }

  onClear() {
    this.EpsFiltered = this.Eps;
    this.instanciarTabla(this.respaldo);
    this.filtered.setValue('');
  }

  onClick(option: string) {
    this.instanciarTabla(this.respaldo);
    const newArr = this.dataSource.data.filter((r: any) => r.GDENOMBRE === option);
    this.instanciarTabla(newArr);
  }

  applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }

  async onSelectRow(row: any) {
    if (this.data.key === 3 && this.onConsult === false) {
      const url = `radicacion-de-facturacion/contrato?fechaInicio=${this.data.inicioReporte}&fechaFin=${this.data.finalReporte}&contrato=${row.GENTERCER}`;
      this.api.get(url).subscribe(res => {
        if (res.success) {
          this.onConsult = true;
          this.description = 'Radicación por contratos';
          this.canBeSelect = false;
          this.displayedColumns = [
            'GDENOMBRE',
            'CANT',
            'RAD',
            'ANU',
            'FACTURADO',
            'RADICABLE',
            'RADICADO',
            'PORC',
          ];
          this.paginator.pageIndex = 0;
          this.dataSource = new MatTableDataSource<any>(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    }
  }

  generarReporte() {
    let newArray = this.dataSource.data;
    this.excel.exportToExcel(newArray, 'reporte');
  }

  back() {
    this.onConsult = false;
    this.canBeSelect = true;
    this.description = 'Radicación por entidades';
    this.displayedColumns = this.oldDisplayedColumns;
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource<any>(this.data.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async onChangeValue() {
    const start = `${this.year.value}-${this.month.value}-01`;
    const end = `${this.year.value}-${this.month.value}-${this._timer.daysInMonth(
      start
    )}`;
    const inicioReporte = this._timer.formatDate(start);
    const finalReporte = this._timer.formatDate(end);
    if (this._timer.getDate(end) <= this._timer.lastDayOfActualMonth()) {
      const newArray: any = [];
      this.oldDatasource.map((r: any) => {
        const fechaFactura = this._timer.formatDate(r.SFAFECFAC);
        if (fechaFactura >= inicioReporte && fechaFactura <= finalReporte) {
          newArray.push(r);
        }
      });
      if (this.data.key === 6) {
        const EpsGroup: string[] = [];
        newArray.map((r: any) => {
          if (!JSON.stringify(EpsGroup).includes(r.GDENOMBRE)) {
            EpsGroup.push(r.GDENOMBRE);
          }
        });
        this.Eps = EpsGroup;
        this.EpsFiltered = EpsGroup;
        this.respaldo = newArray;
        //console.log(newArray);
      }
      this.instanciarTabla(newArray);
    } else {
      this.toast.notification('Las fechas no pueden ser superiores al mes actual');
    }
  }

  instanciarTabla(newArray: any) {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource<any>(newArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  bringOldData() {
    if (this.data.key === 6) {
      const EpsGroup: string[] = [];
      this.oldDatasource.map((r: any) => {
        if (!JSON.stringify(EpsGroup).includes(r.GDENOMBRE)) {
          EpsGroup.push(r.GDENOMBRE);
        }
      });
      this.Eps = EpsGroup;
      this.EpsFiltered = EpsGroup;
      this.respaldo = this.oldDatasource;
      //console.log(this.oldDatasource);
    }
    this.instanciarTabla(this.oldDatasource);
  }

  get month(): FormControl {
    return this.Form.controls['month'] as FormControl;
  }
  get year(): FormControl {
    return this.Form.controls['year'] as FormControl;
  }
}
