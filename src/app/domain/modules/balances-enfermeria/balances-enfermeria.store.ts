import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { datasourceObs } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class BalancesEnfermeriaStore {
  constructor(private _timer: TimerService) {}

  private _pacientesSinPeso = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public pacientesSinPeso$ = this._pacientesSinPeso.asObservable();

  public setPacientesSinPeso(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._pacientesSinPeso.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }
}
