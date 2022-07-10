import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from 'src/app/application/services/excel.service';

@Component({
  selector: 'eda-simple-dialog-table',
  templateUrl: './simple-dialog-table.component.html',
  styleUrls: ['./simple-dialog-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaSimpleDialogTable implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  public rowWidthsInPx: number[] = [];
  public unlinedRows : boolean = true;
  public dataSource: any = new MatTableDataSource<any>([]);
  public searchKey: string = '';
  public displayedColumns: any;
  public columnsNames: any;

  constructor(
    private excel: ExcelService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public ngOnInit(): void {
    this.displayedColumns = this.data.displayedColumns;
    this.columnsNames = this.data.columnsNames;
    if (this.data.rowWidthsInPx) {
      this.rowWidthsInPx = this.data.rowWidthsInPx;
    }
    if (this.data.unlinedRows === false) {
      this.unlinedRows = false;
    }
    this._instanceDataSource(this.data.information);
  }

  public onKeyupSearchKey(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  public onClearSearchKey() {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  private _instanceDataSource(data: any): void {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public generarReporte(): void {
    let newArray = this.dataSource.data;
    this.excel.exportToExcel(newArray, this.data.name);
  }
}
