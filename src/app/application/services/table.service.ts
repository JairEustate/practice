import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EdaSimpleDialogTable } from 'src/app/domain/shared/components/tables/simple-dialog-table/simple-dialog-table.component';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private _dialog: MatDialog) {}
  /**
   * Genera tabla con la información recibida y permite
   * exportar excel, no retorna nada.
   * @param title
   * @param displayedColumns
   * @param columnsNames
   * @param dataSource
   */
  public simpleDialogTable(
    title: string,
    excelName: string,
    displayedColumns: any,
    columnsNames: any,
    dataSource: any,
    rowWidthsInPx: number[] = [],
    unlinedRows : boolean = true
  ): void {
    this._dialog.open(EdaSimpleDialogTable, {
      data: {
        title: title,
        name: excelName,
        displayedColumns: displayedColumns,
        columnsNames: columnsNames,
        information: dataSource,
        rowWidthsInPx: rowWidthsInPx,
        unlinedRows: unlinedRows
      },
    });
  }
}
