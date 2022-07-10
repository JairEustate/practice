import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { datasourceObs } from 'src/app/application/services/store.service';
import { TimerService } from 'src/app/application/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class SeguridadStore {
  constructor(private _timer: TimerService) {}

  private _usuarios = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public usuarios$ = this._usuarios.asObservable();

  public setUsuarios(dataSource: any, wasLoaded: boolean): void {
    const lastUpdated = this._timer.getDate();
    this._usuarios.next({
      dataSource: dataSource,
      lastUpdated: lastUpdated,
      wasLoaded: wasLoaded,
    });
  }
}
