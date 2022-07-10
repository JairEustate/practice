import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/application/services/excel.service';
import { ApiService } from 'src/app/application/services/api.service';
import { TableService } from 'src/app/application/services/table.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'pfgp-consolidado',
  templateUrl: './consolidado.component.html',
  styleUrls: ['./consolidado.component.scss', '../estadistico-pfgp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoPfgpConsolidado implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @Input() inicioReporte: any;
  @Input() finalReporte: any;
  private _unsubscribe$ = new Subject<void>();
  public dataSource: any = new MatTableDataSource<any>([]);
  public searchKey: any;
  public displayedColumns: any = [
    'NContrato',
    'Contrato',
    'TotalEjecutado',
    'TotalFacturado',
    'Iteraciones',
    'ErrorAbsoluto',
    'ErrorRelativo',
    'Porcentaje',
  ];
  public columnsNames: any = [
    'N° Contrato',
    'Contrato',
    'Total Cargado',
    'Total Contratado',
    'Iteraciones',
    'Diferencia $',
    'Diferencia %',
    'Ejecutado %',
  ];
  public visualizeContratos: boolean = true;
  public visualizeAgrupadores: FormControl = new FormControl(false);
  public visualizePacientes: boolean = false;
  public contratoSeleccionado!: string;
  public nombrecontratoSeleccionado!: string;
  public tableTitle: string = 'Contratos';
  public CheckTitle: string = 'Ver Agrupadores';
  public contratosValues: any = [];
  public agrupadoresValues: any = [];
  public loading: boolean = false;
  public rowWidthsInPx: number[] = [80, 300, 120, 120, 60, 120, 80, 80];

  constructor(
    private _tableService: TableService,
    private _cd: ChangeDetectorRef,
    private _excel: ExcelService,
    private _toast: ToastService,
    private _api: ApiService
  ) {
    this.visualizeAgrupadores.valueChanges
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (!value) {
          this.CheckTitle = 'Ver Agrupadores';
        }
        if (value) {
          this.CheckTitle = 'Ver Pacientes';
        }
        if (this.visualizeAgrupadores.disabled) {
          this.CheckTitle = '';
        }
        _cd.markForCheck();
      });
  }

  public ngOnInit(): void {
    this.getContratos();
  }

  public getContratos(): void {
    this.loading = true;
    const url = `pgp/consolidado-contrato?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.instanciarTabla(res.data);
        this.contratosValues = res.data;
      }
      this.loading = false;
    });
  }

  public backToContratos(): void {
    this.tableTitle = `Contratos`;
    this.visualizeContratos = true;
    this.visualizePacientes = false;
    this.displayedColumns = [
      'NContrato',
      'Contrato',
      'TotalEjecutado',
      'TotalFacturado',
      'Iteraciones',
      'ErrorAbsoluto',
      'ErrorRelativo',
      'Porcentaje',
    ];
    this.columnsNames = [
      'N° Contrato',
      'Contrato',
      'Total Ejecutado',
      'Total Facturado',
      'Iteraciones',
      'Diferencia $',
      'Diferencia %',
      'Ejecutado %',
    ];
    this.visualizeAgrupadores.enable();
    this.rowWidthsInPx = [80, 300, 120, 120, 60, 120, 80, 80];
    this.instanciarTabla(this.contratosValues);
  }

  public getPacientes(row: any): void {
    this.loading = true;
    this.visualizeContratos = false;
    this.visualizePacientes = true;
    this.contratoSeleccionado = row.NContrato;
    const url = `pgp/consolidado-pacientes?contrato=${row.NContrato}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;

    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.tableTitle = `Pacientes de ${row.Contrato}`;
        this.displayedColumns = [
          'Ingreso',
          'Paciente',
          'FechaIngreso',
          'Estado',
          'Cama',
          'CodCama',
        ];
        this.columnsNames = [
          'Ingreso',
          'Paciente',
          'Fecha Ingreso',
          'Estado',
          'Cama',
          'Codigo Cama',
        ];
        this.rowWidthsInPx = [80, 250, 100, 100, 200, 80];
        this.instanciarTabla(res.data);
      }
      this.loading = false;
    });
  }

  public getServiciosPaciente(row: any): void {
    if (row.Estado === 'FACTURADO') {
      const url = `pgp/servicios-pacientes?ingreso=${row.Ingreso}&contrato=${this.contratoSeleccionado}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;
      this._api.get(url).subscribe(res => {
        if (res.success) {
          this._tableService.simpleDialogTable(
            `Servicios prestados a ${row.Paciente}`,
            `Servicios_${row.Paciente}`,
            ['ServicioCodigo', 'ServicioNombre', 'TotalEjecutado'],
            ['Codigo', 'Servicio', 'Total Cargado'],
            res.data,
            [110, 350, 100],
            false
          );
        }
      });
    }
    if (row.Estado === 'ACOSTADO') {
      const url = `pgp/ServiciospacientesAcostados?contrato=${this.contratoSeleccionado}&ingreso=${row.Ingreso}`;
      this._api.get(url).subscribe(res => {
        if (res.success) {
          this._tableService.simpleDialogTable(
            `Servicios prestados a ${row.Paciente}`,
            `Servicios_${row.Paciente}`,
            ['ServicioCodigo', 'ServicioNombre', 'TotalEjecutado'],
            ['Codigo', 'Servicio', 'Total Cargado'],
            res.data,
            [110, 350, 100],
            false
          );
        }
      });
    }
  }

  public getAgrupadores(row: any): void {
    this.loading = true;
    this.visualizeAgrupadores.disable();
    const url = `pgp/agrupadores-consolidado?contrato1=${row.NContrato}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.visualizeContratos = false;
        this.tableTitle = `Agrupadores de ${row.Contrato}`;
        this.displayedColumns = [
          'Agrupador',
          'TotalCargado',
          'TotalContratado',
          'ErrorAbsoluto',
          'ErrorRelativo',
          'Porcentaje',
        ];
        this.columnsNames = [
          'Agrupador',
          'Total Cargado',
          'Total Contratado',
          'Diferencia $',
          'Diferencia %',
          'Ejecutado %',
        ];
        this.rowWidthsInPx = [300, 120, 120, 120, 80, 60];
        this.instanciarTabla(res.data);
      } else {
        this._toast.notification('No se pudo obtener información');
        this.visualizeAgrupadores.enable();
      }
      this.loading = false;
      this._cd.markForCheck();
    });
  }

  public onExportExcel(): void {
    this._excel.exportToExcel(this.dataSource.data, 'Consolidado');
  }

  public instanciarTabla(data: any): void {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
