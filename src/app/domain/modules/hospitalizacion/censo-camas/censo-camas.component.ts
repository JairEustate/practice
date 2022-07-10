import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/application/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { CensoCamasService } from './censo-camas.services';
import { HospitalizacionStore } from '../hospitalizacion.store';

@Component({
  selector: 'app-censo-camas',
  templateUrl: './censo-camas.component.html',
  styleUrls: ['./censo-camas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CensoCamas implements OnInit, OnDestroy {
  dispColCensoCamas: string[] = [
    'CAMAS',
    'OCUPADAS',
    'PORC_OCUPADAS',
    'DESOCUPADAS',
    'PORC_DESOCUPADAS',
  ];
  displayedColumns: any = ['HGRCODIGO', 'HGRNOMBRE'].concat(this.dispColCensoCamas);
  columnNames: any = ['Código', 'Nombre', 'Camas', 'Ocup.', '(%)', 'Disp.', '(%)'];
  private unsubscribe$ = new Subject<void>();
  camas: any;
  camasPorSubgrupos: any = [];
  grupoCamas: any;
  subgrupoCamas: any;
  subgruposCamasArray: string[] = [];
  onVisualizeCamas: boolean = false;
  onVisualizeGrupoCamas: boolean = true;
  onVisualizeSubgrupoCamas: boolean = false;
  showingGrupoCamas: boolean = false;
  showingSubgrupoCamas: boolean = false;
  loading: boolean = false;
  title: string = 'Censo de camas de hospitalización';
  lastUpdated!: string;
  titleLastSubgrupo: string = '';
  gruposText: string = '26 grupo(s) - ';
  camasText: string = 'Total: 1132 cama(s)';
  columnResalted: string = 'HGRCODIGO';
  rowWidthsInPx: number[] = [80, 360];
  showTotalOnFooterRow: boolean = true;

  constructor(
    private _hospitalizacionStore: HospitalizacionStore,
    private service: CensoCamasService,
    private _store: StoreService,
    private _timer: TimerService,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    this._hospitalizacionStore.censoCamas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (data.wasLoaded) {
          this.gruposText = `${data.dataSourceGrupos.length} grupo(s) - `;
          this.grupoCamas = this.service.calcPorcCamas(data.dataSourceGrupos);
          this._store.setDataSource(this.grupoCamas);
          this.camas = data.dataSourceCamas;
          this.camasText = `Total: ${data.dataSourceCamas.length} cama(s)`;
          this.lastUpdated = `Actualizado ${data.lastUpdated.fromNow()}`;
        } else {
          this.inicialize();
        }
      });
  }

  public inicialize(): void {
    this.loading = true;
    this._getGruposCamas();
  }

  private _getGruposCamas(): void {
    const url = `censo-camas`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.gruposText = `${res.data.length} grupo(s) - `;
        this.grupoCamas = res.data;
        this._getCamas();
      } else {
        this.loading = false;
      }
    });
  }

  private _getCamas(): void {
    const url = `censo-camas/list`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.camas = res.data;
        this._hospitalizacionStore.setCensoCamas(this.grupoCamas, this.camas, true);
        this.camasText = `Total: ${res.data.length} cama(s)`;
      }
      this.loading = false;
    });
  }

  public getSubgrupoCamas(row: any): void {
    this.loading = true;
    const url = `censo-camas/grupo/${row.HGRCODIGO}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.onVisualizeGrupoCamas = false;
        this.onVisualizeSubgrupoCamas = true;
        this.displayedColumns = ['HSUCODIGO', 'HSUNOMBRE'].concat(this.dispColCensoCamas);
        this.columnNames = ['Código', 'Nombre', 'Camas', 'Ocup.', '(%)', 'Disp.', '(%)'];
        this.subgrupoCamas = this.service.calcPorcSubgCamas(res.data);
        this._store.setDataSource(this.subgrupoCamas);
        this.title = `Grupo: ${row.HGRNOMBRE}`;
        this.titleLastSubgrupo = `Grupo: ${row.HGRNOMBRE}`;
        this.gruposText = `${res.data.length} subgrupo(s) - `;
        let camasEnSubgrupos = 0;
        res.data.map((r: any) => {
          this.subgruposCamasArray.push(r.HSUCODIGO);
          camasEnSubgrupos = camasEnSubgrupos + r.CAMAS;
        });
        this.camas.map((r: any) => {
          if (this.subgruposCamasArray.indexOf(r.HSUCODIGO) >= 0) {
            this.camasPorSubgrupos.push(r);
          }
        });
        this.camasText = `Total: ${camasEnSubgrupos} cama(s)`;
        this.loading = false;
        this.columnResalted = 'HSUCODIGO';
      }
    });
  }

  public showCamas(): void {
    this.onVisualizeCamas = true;
    if (this.onVisualizeGrupoCamas) {
      this.onVisualizeGrupoCamas = false;
      this.showingGrupoCamas = true;
      this.showingSubgrupoCamas = false;
      this.displayedColumns = ['HCACODIGO', 'GPANOMPAC', 'AINCONSEC', 'GDENOMBRE'];
      this.columnNames = ['Código', 'Nombre', 'Ingreso', 'Contrato'];
      this.title = 'Listado de camas de la institución';
      this.gruposText = '';
      this._store.setDataSource(this.camas);
    } else if (this.onVisualizeSubgrupoCamas) {
      this.onVisualizeSubgrupoCamas = false;
      this.showingGrupoCamas = false;
      this.showingSubgrupoCamas = true;
      this.displayedColumns = ['HCACODIGO', 'GPANOMPAC', 'AINCONSEC', 'GDENOMBRE'];
      this.columnNames = ['Código', 'Nombre', 'Ingreso', 'Contrato'];
      this.title = this.titleLastSubgrupo;
      this.gruposText = '';
      this._store.setDataSource(this.camasPorSubgrupos);
    }
    this.columnResalted = 'HCACODIGO';
    this.rowWidthsInPx = [80, 350, 80, 350];
    this.showTotalOnFooterRow = false;
  }

  public backToGruposCamas(): void {
    this.onVisualizeCamas = false;
    this.onVisualizeGrupoCamas = true;
    this.onVisualizeSubgrupoCamas = false;
    this.displayedColumns = ['HGRCODIGO', 'HGRNOMBRE'].concat(this.dispColCensoCamas);
    this.columnNames = ['Código', 'Nombre', 'Camas', 'Ocup.', '(%)', 'Disp.', '(%)'];
    this.title = 'Censo de camas de hospitalización';
    this.gruposText = `${this.grupoCamas.length} grupo(s) - `;
    this.camasText = `Total: ${this.camas.length} cama(s)`;
    this.subgruposCamasArray = [];
    this.camasPorSubgrupos = [];
    this.titleLastSubgrupo = '';
    this._store.setDataSource(this.grupoCamas);
    this.columnResalted = 'HGRCODIGO';
    this.rowWidthsInPx = [80, 360];
    this.showTotalOnFooterRow = true;
  }

  public backToSubgruposCamas(): void {
    this.onVisualizeCamas = false;
    this.showingGrupoCamas = true;
    this.showingSubgrupoCamas = false;
    this.onVisualizeSubgrupoCamas = true;
    this.displayedColumns = ['HSUCODIGO', 'HSUNOMBRE'].concat(this.dispColCensoCamas);
    this.columnNames = ['Código', 'Nombre', 'Camas', 'Ocup.', '(%)', 'Disp.', '(%)'];
    this.title = this.titleLastSubgrupo;
    this.gruposText = `${this.subgrupoCamas.length} subgrupo(s) - `;
    this.camasText = `Total: ${this.camasPorSubgrupos.length} cama(s)`;
    this._store.setDataSource(this.subgrupoCamas);
    this.columnResalted = 'HSUCODIGO';
    this.rowWidthsInPx = [80, 360];
    this.showTotalOnFooterRow = true;
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
