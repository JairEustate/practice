import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CentroAtencionI } from 'src/app/application/interfaces/centro-atencion.interface';
import { ExcelService } from 'src/app/application/services/excel.service';
import { EstadisticoPfgpService } from '../estadistico-pfgp.services';
import { ApiService } from 'src/app/application/services/api.service';
import { TableService } from 'src/app/application/services/table.service';
@Component({
  selector: 'pfgp-acostado',
  templateUrl: './acostado.component.html',
  styleUrls: ['./acostado.component.scss', '../estadistico-pfgp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoPfgpAcostado implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @Input() inicioReporte: any;
  @Input() finalReporte: any;
  @Input() diferenciaConsolidado: any;
  @Input() isActualMonth: any;
  @Input() centrosAtencion: CentroAtencionI[] = [];
  @Input() context!: string;
  public dataSource: any = new MatTableDataSource<any>([]);
  public searchKey: any;
  public displayedColumns: any;
  public columnsNames: any;
  public loading: boolean = false;
  public visualizeContratos: boolean = true;
  public contratoSeleccionado!: string;
  public nombrecontratoSeleccionado!: string;
  public visualizePacientes: boolean = false;
  public tableTitle: string = 'Contratos';
  public dispColContratos: any;
  public ColNamContratos: any;
  public contratosValues: any = [];
  public agrupadoresValues: any = [];
  public id1!: number;
  public id2!: number;
  public id1U!: number;
  public id2U!: number;
  public rowWidthsInPx: number[] = [80, 300, 60, 120, 120, 120, 80, 120, 80];

  constructor(
    private _api: ApiService,
    private _tableService: TableService,
    private _excel: ExcelService,
    private _estadisticoPfgpService: EstadisticoPfgpService
  ) {}

  public ngOnInit(): void {
    this.id1U = this.centrosAtencion[0].id;
    if (this.centrosAtencion.length === 1) {
      this.id2U = this.centrosAtencion[0].id;
    } else {
      this.id2U = this.centrosAtencion[1].id;
    }
    if (this.isActualMonth) {
      this.dispColContratos = [
        'NContrato',
        'Contrato',
        'Iteraciones',
        'TotalEjecutado',
        'TotalFacturado',
        'ErrorAbsoluto',
        'ErrorRelativo',
        'Disponibilidad',
        'Porcentaje',
      ];
      this.ColNamContratos = [
        'N° Contrato',
        'Contrato',
        'Pacientes',
        'Total Cargado',
        'Total Contratado',
        'Diferencia $',
        'Diferencia %',
        'Disponibilidad',
        'Ejecutado %',
      ];
      this.displayedColumns = this.dispColContratos;
      this.columnsNames = this.ColNamContratos;
    } else {
      this.dispColContratos = [
        'NContrato',
        'Contrato',
        'Iteraciones',
        'TotalEjecutado',
        'TotalFacturado',
        'ErrorAbsoluto',
        'ErrorRelativo',
        'Porcentaje',
      ];
      this.ColNamContratos = [
        'N° Contrato',
        'Contrato',
        'Pacientes',
        'Total Cargado',
        'Total Contratado',
        'Diferencia $',
        'Diferencia %',
        'Ejecutado %',
      ];
      this.displayedColumns = this.dispColContratos;
      this.columnsNames = this.ColNamContratos;
    }
    this.getContratos();
  }

  public selectCentroAtencion(id1U: number, id2U: number): void {
    if (id1U !== this.id1 || id2U !== this.id2) {
      this.getContratos(id1U, id2U);
    }
  }

  public getContratos(id1: number = this.id1U, id2: number = this.id2U): void {
    this.id1 = id1;
    this.id2 = id2;
    let url = '';
    if (this.isActualMonth) {
      url = `pgp/consumido-acostado?centro1=${id1}&centro2=${id2}`;
    } else {
      url = `pgp/consumido-acostado-antiguo?centro1=${id1}&centro2=${id2}`;
    }
    this.loading = true;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.contratosValues = this._estadisticoPfgpService.getDisponibilidad(
          res.data,
          this.diferenciaConsolidado
        );
        this.instanciarTabla(this.contratosValues);
      }
      this.loading = false;
    });
  }

  public getPacientes(row: any): void {
    let url = '';
    if (this.isActualMonth) {
      url = `pgp/pacientesAcostados?contrato=${row.NContrato}&centro1=${this.id1}&centro2=${this.id2}`;
    }
    if (!this.isActualMonth) {
      url = `pgp/pacientesAcostadosAntiguo?contrato=${row.NContrato}&centro1=${this.id1}&centro2=${this.id2}`;
    }
    this.loading = true;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.contratoSeleccionado = row.NContrato;
        this.nombrecontratoSeleccionado = row.Contrato;
        this.tableTitle = `Pacientes de ${row.Contrato}`;
        this.visualizeContratos = false;
        this.visualizePacientes = true;
        this.displayedColumns = [
          'Ingreso',
          'Paciente',
          'AINFECING',
          'DiasEstancia',
          'CodCama',
          'TipoIngreso',
          'TotalEjecutado',
          'Acciones',
        ];
        this.columnsNames = [
          'Ingreso',
          'Paciente',
          'Fecha Ingreso',
          'Dias Estancia',
          'Cama',
          'Tipo Ingreso',
          'Total Cargado',
          'Acciones',
        ];
        this.rowWidthsInPx = [80, 300, 100, 60, 90, 90, 120, 120];
        this.instanciarTabla(res.data);
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  public backToContratos(): void {
    this.visualizeContratos = true;
    this.visualizePacientes = false;
    this.tableTitle = 'Contratos';
    this.displayedColumns = [
      'NContrato',
      'Contrato',
      'Iteraciones',
      'TotalEjecutado',
      'TotalFacturado',
      'ErrorAbsoluto',
      'ErrorRelativo',
      'Porcentaje',
    ];
    this.columnsNames = [
      'N° Contrato',
      'Contrato',
      'Pacientes',
      'Total Cargado',
      'Total Contratado',
      'Diferencia $',
      'Diferencia %',
      'Ejecutado %',
    ];
    this.rowWidthsInPx = [80, 300, 60, 120, 120, 120, 80, 120, 80];
    this.instanciarTabla(this.contratosValues);
  }

  public onExportExcel(): void {
    let newArray = this.dataSource.data;
    if (this.visualizeContratos) {
      this._excel.exportToExcel(newArray, 'Contratos');
    } else {
      this._excel.exportToExcel(newArray, 'Pacientes');
    }
  }

  public showDialog(type: string, row: any = null): void {
    if (type === 'estancia') {
      this._tableService.simpleDialogTable(
        `Estancias de ${row.Paciente}`,
        `Estancias_${row.Paciente}`,
        ['Grupo', 'Cama', 'FechaIngreso', 'FechaSalida'],
        ['Subgrupo', 'Cama', 'Fecha Ingreso', 'Fecha Salida'],
        row.Estancia,
        [350, 100, 100]
      );
    }
    if (type === 'agrupadores') {
      const url = `pgp/AgrupadorespacientesAcostados?contrato=${this.contratoSeleccionado}&ingreso=${row.Ingreso}`;
      this._api.get(url).subscribe(res => {
        if (res.success) {
          this._tableService.simpleDialogTable(
            `Agrupadores de ${row.Paciente}`,
            `Agrupadores_${row.Paciente}`,
            ['AGRUPADOR', 'SUMA'],
            ['Agrupador', 'Total Cargado'],
            res.data,
            [300, 80]
          );
        }
      });
    }
    if (type === 'servicios') {
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

  public instanciarTabla(data: any): void {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }
}
