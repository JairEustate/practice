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
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';
import { EstadisticoPfgpService } from '../estadistico-pfgp.services';
import { TableService } from 'src/app/application/services/table.service';
@Component({
  selector: 'pfgp-facturado',
  templateUrl: './facturado.component.html',
  styleUrls: ['./facturado.component.scss', '../estadistico-pfgp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoPfgpFacturado implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @Input() inicioReporte: any;
  @Input() finalReporte: any;
  @Input() diferenciaConsolidado: any;
  @Input() isActualMonth: any;
  @Input() centrosAtencion: CentroAtencionI[] = [];
  @Input() context!: string;
  public dataSource: any = new MatTableDataSource<any>([]);
  public displayedColumns: any;
  public columnsNames: any;
  public rowWidthsInPx: number[] = [80, 250, 120, 120, 120, 60, 120, 80, 120, 80];
  public searchKey: any;
  public loading: boolean = false;
  public visualizeContratos: boolean = false;
  public contratoSeleccionado!: string;
  public agrupadorSeleccionado!: string;
  public nombrecontratoSeleccionado!: string;
  public visualizeAgrupadores: boolean = false;
  public visualizePacientes: boolean = false;
  public tableTitle: string = 'Contratos';
  public dispColContratos: any;
  public ColNamContratos: any;
  public contratosValues: any = [];
  public agrupadoresValues: any = [];
  public largasEstancias: any;
  public id1!: number;
  public id2!: number;
  public id1U!: number;
  public id2U!: number;

  constructor(
    private _estadisticoPfgpService: EstadisticoPfgpService,
    private _toast: ToastService,
    private _tableService: TableService,
    private _excel: ExcelService,
    private _api: ApiService
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
        'TotalEjecutado',
        'ValorAnticipo',
        'TotalFacturado',
        'Iteraciones',
        'ErrorAbsoluto',
        'ErrorRelativo',
        'Disponibilidad',
        'Porcentaje',
      ];
      this.ColNamContratos = [
        'N°',
        'Contrato',
        'Total Facturado',
        'CTA Recuperación',
        'Total Contratado',
        'Iteraciones',
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
        'TotalEjecutado',
        'ValorAnticipo',
        'TotalFacturado',
        'Iteraciones',
        'ErrorAbsoluto',
        'ErrorRelativo',
        'Porcentaje',
      ];
      this.ColNamContratos = [
        'N°',
        'Contrato',
        'Total Facturado',
        'CTA Recuperación',
        'Total Contratado',
        'Iteraciones',
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
    this.loading = true;
    this.visualizeContratos = true;
    const url = `pgp/consumido-facturado?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&centro1=${id1}&centro2=${id2}`;
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

  public backToContratos(): void {
    this.visualizeContratos = true;
    this.visualizeAgrupadores = false;
    this.tableTitle = `Contratos`;
    this.displayedColumns = this.dispColContratos;
    this.columnsNames = this.ColNamContratos;
    this.rowWidthsInPx = [80, 250, 120, 120, 120, 60, 120, 80, 120, 80];
    this.instanciarTabla(this.contratosValues);
  }

  public getAgrupadores(row: any): void {
    this.loading = true;
    const params = this._estadisticoPfgpService.getContratosByContext(
      this.context,
      row.NContrato
    );
    const url = `pgp/agrupadores?contrato1=${params.contrato1}&contrato2=${params.contrato2}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&centro1=${this.id1}&centro2=${this.id2}`;
    const url2 = `pgp/largas-estancia?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&contrato1=${params.contrato1}&contrato2=${params.contrato2}`;
    this._api.get(url2).subscribe(res => {
      this.largasEstancias = res.data;
    });
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.visualizeContratos = false;
        this.visualizeAgrupadores = true;
        this.tableTitle = `Agrupadores de ${row.Contrato}`;
        this.contratoSeleccionado = params.contratoSeleccionado;
        this.nombrecontratoSeleccionado = row.Contrato;
        this.displayedColumns = [
          'Agrupador',
          'TotalEjecutado',
          'TotalFacturado',
          'Iteraciones',
          'Eventos',
          'EventosSobrantes',
          'CmeEjecutado',
          'CmeFacturado',
          'ErrorAbsoluto',
          'ErrorRelativo',
          'Porcentaje',
        ];
        this.columnsNames = [
          'Agrupador',
          'Total Facturado',
          'Total Contratado',
          'Ev. Realizados',
          'Ev. Contratados',
          'Dif. Eventos',
          'CME Facturado',
          'CME Contratado',
          'Diferencia $',
          'Diferencia %',
          'Ejecutado %',
        ];
        this.agrupadoresValues = res.data;
        this.rowWidthsInPx = [280, 120, 120, 60, 60, 60, 120, 120, 120, 80, 80];
        this.instanciarTabla(res.data);
      }
      this.loading = false;
    });
  }

  public seeLargasEstancias(): void {
    this._tableService.simpleDialogTable(
      `Largas Estancias de ${this.nombrecontratoSeleccionado}`,
      `Largas_Estancias_${this.nombrecontratoSeleccionado}`,
      ['Agrupador', 'PACIENTES'],
      ['Agrupador', 'Pacientes'],
      this.largasEstancias,
      [300, 80]
    );
  }

  public backToAgrupadores(): void {
    this.tableTitle = `Agrupadores de ${this.nombrecontratoSeleccionado}`;
    this.visualizeAgrupadores = true;
    this.visualizePacientes = false;
    this.displayedColumns = [
      'Agrupador',
      'TotalEjecutado',
      'TotalFacturado',
      'Iteraciones',
      'Eventos',
      'EventosSobrantes',
      'CmeEjecutado',
      'CmeFacturado',
      'ErrorAbsoluto',
      'ErrorRelativo',
      'Porcentaje',
    ];
    this.columnsNames = [
      'Agrupador',
      'Total Facturado',
      'Total Contratado',
      'Ev. Realizados',
      'Ev. Contratados',
      'Dif. Eventos',
      'CME Ejecutado',
      'CME Facturado',
      'Diferencia $',
      'Diferencia %',
      'Ejecutado %',
    ];
    this.rowWidthsInPx = [280, 120, 120, 60, 60, 60, 120, 120, 120, 80, 80];
    this.instanciarTabla(this.agrupadoresValues);
  }

  public getPacientes(row: any): void {
    const params = this._estadisticoPfgpService.getContratosByContext(
      this.context,
      this.contratoSeleccionado
    );
    const url = `pgp/pacientes-agrupador?agrupador=${row.Agrupador}&contrato1=${params.contrato1}&contrato2=${params.contrato2}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&centro1=${this.id1}&centro2=${this.id2}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        if (res.data.length > 0) {
          this.loading = true;
          setTimeout(() => {
            this.tableTitle = `Pacientes de ${row.Agrupador}`;
            this.visualizeAgrupadores = false;
            this.visualizePacientes = true;
            this.displayedColumns = [
              'Ingreso',
              'Paciente',
              'TotalEjecutado',
              'TotalAnticipo',
              'Cme',
              'DiasEstancia',
              'Acciones',
            ];
            this.columnsNames = [
              'Ingreso',
              'Paciente',
              'Total Facturado',
              'CTA Recuperación',
              'CME',
              'Estancia',
              'Acciones',
            ];
            this.rowWidthsInPx = [80, 280, 120, 120, 120, 60, 120];
            this.instanciarTabla(res.data);
            this.loading = false;
          }, 500);
        } else {
          this._toast.notification('Este agrupador no tiene pacientes relacionados');
        }
      } else {
        this.loading = false;
      }
    });
  }

  public getServiciosPacientes(row: any): void {
    const url = `pgp/servicios-pacientes?ingreso=${row.Ingreso}&contrato=${this.contratoSeleccionado}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this._tableService.simpleDialogTable(
          `Servicios prestados a ${row.Paciente}`,
          `Servicios_${row.Paciente}`,
          ['ServicioCodigo', 'ServicioNombre', 'TotalEjecutado'],
          ['Codigo', 'Servicio', 'Total Cargado'],
          res.data,
          [120, 350, 80],
          false
        );
      }
    });
  }

  public getAgrupadoresPacientes(row: any): void {
    const url = `pgp/historial-agrupadores?contrato=${this.contratoSeleccionado}&ingreso=${row.Ingreso}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this._tableService.simpleDialogTable(
          `Agrupadores de ${row.Paciente}`,
          `Agrupadores_${row.Paciente}`,
          ['Agrupador', 'TotalEjecutado'],
          ['Agrupador', 'Total Cargado'],
          res.data,
          [120, 80]
        );
      }
    });
  }

  public instanciarTabla(data: any): void {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public generarReporte(): void {
    let newArray = this.dataSource.data;
    if (this.visualizeContratos) {
      this._excel.exportToExcel(newArray, 'Contratos');
    }
    if (this.visualizeAgrupadores) {
      this._excel.exportToExcel(newArray, 'Agrupadores');
    }
    if (this.visualizePacientes) {
      this._excel.exportToExcel(newArray, 'Pacientes');
    }
  }

  public applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }
}
