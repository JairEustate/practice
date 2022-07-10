import {
  OnInit,
  Inject,
  ViewChild,
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/application/services/excel.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';

@Component({
  selector: 'radicacion-facturacion-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturacionPeriodoDialog implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  public rowWidthsInPx: number[] = [];
  public dataSource: any = new MatTableDataSource<any>([]);
  public description: string = this.data.description;
  public displayedColumns: any;
  public onConsult: boolean = false;
  public canBeSelect: boolean = false;
  public key: number = this.data.key;
  public columnsNames: any = [
    'Nombre',
    'Can.',
    'Can. Refact.',
    'Anu.',
    'Producción',
    'Anulado',
    'Refacturado',
    'Facturado',
  ];
  //en caso key === 5
  loading: boolean = false;
  oldColumnsNames: any;
  oldDisplayedColumns: any;
  oldDataSource: any;
  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<FacturacionPeriodoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private excel: ExcelService,
    private toast: ToastService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data.rowWidthsInPx) {
      this.rowWidthsInPx = this.data.rowWidthsInPx;
    }
    this.displayedColumns = this.data.displayedColumns;
    if ([6, 7, 8, 9].indexOf(this.data.key) >= 0) {
      this.columnsNames = [
        'Nombre',
        'Can.',
        'Anu.',
        'Producción',
        'Anulado',
        'Refacturado',
        'Facturado',
      ];
    }
    this.instanciarTabla(this.data.data);
    if (this.data.key === 5) {
      this.oldDisplayedColumns = this.displayedColumns;
      this.oldDataSource = this.dataSource.data;
      this.oldColumnsNames = this.columnsNames;
      this.canBeSelect = true;
    }
  }
  applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }
  onSelectRow(row: any) {
    if (this.data.key === 5 && this.onConsult === false) {
      this.loading = true;
      this.instanciarTabla([]);
      const url = `facturacion/contratos?fechaInicio=${this.data.inicioReporte}&fechaFin=${this.data.finalReporte}&entidad=${row.GENTERCER}`;
      this.api.get(url).subscribe(res => {
        if (res.success) {
          this.onConsult = true;
          this.description = 'Producción por contratos';
          this.canBeSelect = false;
          this.displayedColumns = [
            'NOMBRE',
            'DOCUMENTOS',
            'FACTURASANULADAS',
            'PRODUCCION',
            'TOTALFACTURASANULADAS',
            'FACTURADO',
          ];
          this.columnsNames = [
            'Nombre',
            'Can.',
            'Anu.',
            'Producción',
            'Anulado',
            'Facturado',
          ];
          this.instanciarTabla(res.data);
        } else {
          this.instanciarTabla(this.oldDataSource);
          this.toast.notification('No se obtuvieron los contratos');
        }
        this.loading = false;
        this.cd.markForCheck();
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
    this.description = 'Producción por entidades';
    this.displayedColumns = this.oldDisplayedColumns;
    this.columnsNames = this.oldColumnsNames;
    this.instanciarTabla(this.oldDataSource);
  }
  instanciarTabla(newArray: any) {
    this.dataSource = new MatTableDataSource<any>(newArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
