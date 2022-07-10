import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { datasourceObs } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class CarteraStore {
  constructor(private _timer: TimerService) {}

  private _gestion = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  private _conciliacion = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public gestion$ = this._gestion.asObservable();

  public conciliacion$ = this._conciliacion.asObservable();

  public setGestion(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._gestion.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }

  public setConciliacion(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._conciliacion.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }
}
