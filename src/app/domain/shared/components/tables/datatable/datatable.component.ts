import {
  EventEmitter,
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  Output,
  Input,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GroupI } from 'src/app/application/interfaces/group.interface';
import { ExcelService } from 'src/app/application/services/excel.service';
import { GroupService } from 'src/app/application/services/group.service';
import { StoreService } from 'src/app/application/services/store.service';
import { environment } from 'src/environments/environment';
import { MediaMatcher } from '@angular/cdk/layout';
import { mobileQuery } from 'src/app/app.information';
@Component({
  selector: 'eda-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class EdaDatatable implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public url = environment.API_URL;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  public dataSource: any = [];
  @Input() class: string = '';
  @Input() style: string = '';
  @Input() hasPaginator: boolean = true;
  @Input() hasSort: boolean = true;
  @Input() hasFilterField: boolean = true;
  @Input() hasFooterRow: boolean = false;
  @Input() showTotalOnFooterRow: boolean = false;
  @Input() hasBackButton: boolean = false;
  @Input() hasRefreshButton: boolean = true;
  @Input() hasSendButton: boolean = false;
  @Input() hasExportExcelButton: boolean = false;
  @Input() hasExportPdfButton: boolean = false;
  @Input() hasPdfRoute: boolean = false;
  @Input() hasActionsButtons: boolean = false;
  @Input() hasAction2: boolean = false;
  @Input() hasAction3: boolean = false;
  @Input() hasSuggestions: boolean = false;
  @Input() columnForSuggestion: string = 'exampleOfSuggestion';
  public suggestions: string[] = [];
  public suggestionsFiltered: string[] = [];
  @Input() nameActionsColumn: string = 'Acciones';
  @Input() tooltipAction1: string = 'Accion 1';
  @Input() tooltipAction2: string = 'Accion 2';
  @Input() tooltipAction3: string = 'Accion 3';
  @Input() iconAction1: string = 'home';
  @Input() iconAction2: string = 'home';
  @Input() iconAction3: string = 'home';
  @Input() nameExcel!: string;
  @Input() hasSelectableRows: boolean = false;
  @Input() unlinedRows: boolean = true;
  @Input() stickyHeader: boolean = true;
  @Input() loading: boolean = false;
  @Input() validateNullValues: boolean = false;
  @Input() validateDays: boolean = false;
  @Input() displayedColumns: string[] = [];
  @Input() columnNames: string[] = [];
  @Input() columnResalted: string = 'exampleColumnResaltedNonExist';
  @Input() rowTooltip!: string;
  @Input() pxToSubstractFromScrollHeight: number = 271;
  @Input() rowWidthsInPx: number[] = [];
  @Input() rowsHasSubcontent: string[] = [];
  @Input() rowsSubcontent: any = [];
  @Output() selectRow: EventEmitter<any> = new EventEmitter();
  @Output() selectRows: EventEmitter<any> = new EventEmitter();
  @Output() filtering: EventEmitter<any> = new EventEmitter();
  @Output() resetFilter: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() back: EventEmitter<any> = new EventEmitter();
  @Output() action1: EventEmitter<any> = new EventEmitter();
  @Output() action2: EventEmitter<any> = new EventEmitter();
  @Output() action3: EventEmitter<any> = new EventEmitter();
  @Output() exportPdf: EventEmitter<any> = new EventEmitter();
  public lastUpdated: any = 'Actualizar';
  public searchKey: string = '';
  public mobileQuery: MediaQueryList;
  public selection = new SelectionModel<any>(true, []);

  constructor(
    private _store: StoreService,
    private _excel: ExcelService,
    private _group: GroupService,
    _media: MediaMatcher
  ) {
    this.mobileQuery = _media.matchMedia(mobileQuery);
  }

  public ngOnInit(): void {
    this._store.dataSource$.pipe(takeUntil(this._unsubscribe$)).subscribe(data => {
      this.instanceTable(data.dataSource);
      if (data.lastUpdated !== null) {
        this.lastUpdated = `Actualizado ${data.lastUpdated.fromNow()}`;
      }
    });
    if (this.hasActionsButtons) {
      this.columnNames.push(this.nameActionsColumn);
      this.displayedColumns.push(this.nameActionsColumn);
    }
  }

  public onSelectRow(row: any): void {
    if (this.hasSelectableRows) {
      this.selectRow.emit(row);
    }
  }

  public onAction1(row: any): void {
    this.action1.emit(row);
  }

  public onAction2(row: any): void {
    this.action2.emit(row);
  }

  public onAction3(row: any): void {
    this.action3.emit(row);
  }

  public onBack(): void {
    this.back.emit();
  }

  public onRefresh(): void {
    this.refresh.emit();
  }

  public onSend(): void {
    this.send.emit(this.dataSource.data);
  }

  public onExportPdf(): void {
    this.exportPdf.emit();
  }

  public onExportExcel(): void {
    let newArray = this.dataSource.filteredData;
    this._excel.exportToExcel(newArray, `${this.nameExcel ? this.nameExcel : 'reporte'}`);
  }

  public onKeyupSearchKey() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
    if (this.hasSuggestions) {
      let newArr: any = [];
      this.suggestions.map((r: string) => {
        if (r.toLocaleLowerCase().includes(this.searchKey.toLocaleLowerCase())) {
          newArr.push(r);
        }
      });
      this.suggestionsFiltered = newArr;
    }
    this.selection.clear();
    this.filtering.emit(this.dataSource.filteredData);
  }

  public onClearSearchKey() {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
    if (this.hasSuggestions) {
      this.suggestionsFiltered = this.suggestions;
    }
    this.selection.clear();
    this.resetFilter.emit();
  }

  public instanceTable(data: any): void {
    this.paginator.pageIndex = 0;
    this.selection.clear();
    this.searchKey = '';
    this.dataSource = new MatTableDataSource<any>(data);
    if (this.hasPaginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.hasSort) {
      this.dataSource.sort = this.sort;
    }
    if (this.hasSuggestions) {
      let newArr: any[] = [];
      const grouped: GroupI[] = this._group.groupByCommonId(
        data,
        this.columnForSuggestion
      );
      grouped.map((r: GroupI) => {
        newArr.push(r.ID);
      });
      this.suggestions = newArr;
      this.suggestionsFiltered = newArr;
    }
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectRows.emit([]);
      return;
    }
    this.selection.select(...this.dataSource.filteredData);
    this.selectRows.emit(this.selection.selected);
  }

  public clickOnCheckbox(): void {
    setTimeout(() => {
      this.selectRows.emit(this.selection.selected);
    }, 20);
  }

  public onfiltering(): void {
    this.filtering.emit();
  }

  public ngOnDestroy(): void {
    this._store.setDataSource();
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
