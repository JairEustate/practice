import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/application/services/api.service';
import { StoreService } from 'src/app/application/services/store.service';
import { InterconsultaI } from './interconsultas-pendientes.interfaces';
import { GroupService } from 'src/app/application/services/group.service';
import { GroupI } from 'src/app/application/interfaces/group.interface';
import { StadisticI } from 'src/app/application/interfaces/stadistic.interface';
import { InterconsultasPendientesService } from './interconsultas-pendientes.services';
import { HistoriaClinicaStore } from '../historia-clinica.store';

@Component({
  selector: 'app-interconsultas-pendientes',
  templateUrl: './interconsultas-pendientes.component.html',
  styleUrls: ['./interconsultas-pendientes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterconsultasPendientes implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();
  public interconsultas!: InterconsultaI[];
  public interconsultasAgrupadas: GroupI[] = [];
  public interconsultasAgrupadasFiltradas: GroupI[] = [];
  public totalInterconsultas: number = 0;
  public totalInterconsultasFiltradas: number = 0;
  public interconsultaSeleccionada!: InterconsultaI;
  public showInterconsultasAgrupadas: boolean = true;
  //Información de Paciente
  public estPacEspSel01: StadisticI[] = [];
  public estPacEspSel02: StadisticI[] = [];
  public showPacienteSeleccionado: boolean = false;
  //Variables de la tabla
  public displayedColumns: string[] = ['ID', 'NAME', 'AMOUNT'];
  public columnNames: string[] = ['Código', 'Especialidad', 'Cantidad'];
  public columnResalted: string = 'ID';
  public loadingTable: boolean = false;
  public lastUpdateTable: string = 'Actualizar';
  public tableTitle: string = 'Interconsultas por especialidades';
  public tableSubti: string = '0 especialidad (es) - 0 interconsulta (s)';
  public ALTA_CENTRO: string = 'ALTA COMPLEJIDAD DEL CARIBE';
  public MEDICOS_SA: string = 'CLINICA MEDICOS SA';

  constructor(
    private _interconsultasPendientesService: InterconsultasPendientesService,
    private _historiaClinicaStore: HistoriaClinicaStore,
    private _api: ApiService,
    private _store: StoreService,
    private _group: GroupService
  ) {}

  public ngOnInit(): void {
    this._historiaClinicaStore.interconsultasPendientes$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(data => {
        if (!data.wasLoaded) {
          this._getInterconsultasPendientes();
        } else {
          this.interconsultas = data.dataSource;
          const result: GroupI[] = this._group.groupByCommonId(
            data.dataSource,
            'GENESPECI',
            'GEEDESCRI'
            );
            console.log(result)
          this.interconsultasAgrupadas = result;
          this.interconsultasAgrupadasFiltradas = result;
          this.totalInterconsultas = data.dataSource.length;
          this.totalInterconsultasFiltradas = data.dataSource.length;
          result.map((r: GroupI) => {
            r.AMOUNT = r.ROWS.length;
          });
          this._store.setDataSource(result,null,true);
          this.tableTitle = 'Interconsultas por especialidades';
          this.tableSubti = `${result.length} especialidad(es) - ${data.dataSource.length} interconsulta(s)`;
          this.lastUpdateTable = `Actualizado ${data.lastUpdated.fromNow()}`;
        }
      });
  }

  public onUpdateTable(): void {
    if (this.showInterconsultasAgrupadas) {
      this._getInterconsultasPendientes();
    }
  }
  private _getInterconsultasPendientes(): void {
    this.loadingTable = true;
    const url = `interconsultas`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this._historiaClinicaStore.setInterconsultasPendientes(
          res.data,
          true,
        );
      }
      this.loadingTable = false;
    });
  }

  public filtrarPorCentro(filtro: string) {
    if (filtro !== 'ALL') {
      let newArray = this.interconsultas.filter(
        (element: InterconsultaI) => element.ACANOMBRE === filtro
      );
      const result: GroupI[] = this._group.groupByCommonId(
        newArray,
        'GENESPECI',
        'GEEDESCRI'
      );
      result.map((r: GroupI) => {
        r.AMOUNT = r.ROWS.length;
      });
      this._store.setDataSource(result);
      this.interconsultasAgrupadasFiltradas = result;
      this.totalInterconsultasFiltradas = newArray.length;
    } else {
      this._store.setDataSource(this.interconsultasAgrupadas);
      this.interconsultasAgrupadasFiltradas = this.interconsultasAgrupadas;
      this.totalInterconsultasFiltradas = this.totalInterconsultas;
    }
    this.tableSubti = `${this.interconsultasAgrupadasFiltradas.length} especialidad(es) - ${this.totalInterconsultasFiltradas} interconsulta(s)`;
  }

  public onSelectRow(row: any) {
    if (this.showInterconsultasAgrupadas) {
      this._store.setDataSource([]);
      const group: GroupI = row;
      this.displayedColumns = ['HCICONSEC', 'PACNOMBRE', 'ADNINGRESO'];
      this.columnNames = ['Código', 'Paciente', 'Ingreso'];
      this.columnResalted = 'HCICONSEC';
      this._store.setDataSource(group.ROWS);
      this.estPacEspSel01 = this._interconsultasPendientesService.getInfoPaciente_1(group.ROWS[0]);
      this.interconsultaSeleccionada = group.ROWS[0];
      this.estPacEspSel02 = this._interconsultasPendientesService.getInfoPaciente_2(group.ROWS[0]);
      this.showPacienteSeleccionado = true;
      this.tableTitle = `Especialidad: ${group.NAME}`;
      this.tableSubti = `${group.ROWS.length} interconsulta(s)`;
      this.showInterconsultasAgrupadas = false;
    } else {
      this.estPacEspSel01 = this._interconsultasPendientesService.getInfoPaciente_1(row);
      this.interconsultaSeleccionada = row;
      this.estPacEspSel02 = this._interconsultasPendientesService.getInfoPaciente_2(row);
    }
  }

  public onBackToLastTable(): void {
    if (!this.showInterconsultasAgrupadas) {
      this.displayedColumns = ['ID', 'NAME', 'AMOUNT'];
      this.columnNames = ['Código', 'Especialidad', 'Cantidad'];
      this.columnResalted = 'ID';
      this._store.setDataSource(this.interconsultasAgrupadasFiltradas);
      this.showPacienteSeleccionado = false;
      this.tableTitle = 'Interconsultas por especialidades';
      this.tableSubti = `${this.interconsultasAgrupadasFiltradas.length} especialidad(es) - ${this.totalInterconsultasFiltradas} interconsulta(s)`;
      this.showInterconsultasAgrupadas = true;
    }
  }

  public showInformacionPaciente(row: InterconsultaI) {
    this.estPacEspSel01 = this._interconsultasPendientesService.getInfoPaciente_1(row);
    this.interconsultaSeleccionada = row;
    this.estPacEspSel02 = this._interconsultasPendientesService.getInfoPaciente_2(row);
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
