import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { datasourceObs } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';
import { SubgrupoCamaI } from './registro-jornada-dietas/registro-jornada-dietas.interfaces';

interface subgrupoCamaObs {
  centro: any;
  subgrupos: SubgrupoCamaI[];
  wasLoaded: boolean;
}

interface censoCamasObs {
  dataSourceGrupos: any;
  dataSourceCamas: any;
  lastUpdated: any;
  wasLoaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HospitalizacionStore {
  constructor(private _timer: TimerService) {}

  private _censoPacientes = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  private _subgrupos = new BehaviorSubject<subgrupoCamaObs>({
    centro: null,
    subgrupos: [],
    wasLoaded: false,
  });

  private _censoCamas = new BehaviorSubject<censoCamasObs>({
    dataSourceGrupos: [],
    dataSourceCamas: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public censoPacientes$ = this._censoPacientes.asObservable();

  public subgrupos$ = this._subgrupos.asObservable();

  public censoCamas$ = this._censoCamas.asObservable();

  public setCensoPacientes(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._censoPacientes.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }

  public setSubgrupos(
    centro: any = null,
    subgrupos: any = [],
    wasLoaded: boolean = false
  ) {
    this._subgrupos.next({
      centro: centro,
      subgrupos: subgrupos,
      wasLoaded: wasLoaded,
    });
  }

  public setCensoCamas(
    dataSourceGrupos: any = [],
    dataSourceCamas: any = [],
    wasLoaded: boolean = false
  ): void {
    const lastUpdated = this._timer.getDate();
    this._censoCamas.next({
      dataSourceGrupos: dataSourceGrupos,
      dataSourceCamas: dataSourceCamas,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }
}
