import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { datasourceObs } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaStore {
  constructor(private _timer: TimerService) {}

  private _interconsultasPendientes = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public interconsultasPendientes$ = this._interconsultasPendientes.asObservable();

  public setInterconsultasPendientes(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._interconsultasPendientes.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }
}
