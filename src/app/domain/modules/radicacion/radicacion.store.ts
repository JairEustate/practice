import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RadicacionStore {
  private _statusReporte = new BehaviorSubject<string>('No hay reportes pendientes');

  public statusReporte$ = this._statusReporte.asObservable();

  public setStatusReporte(status: string = 'No hay reportes pendientes') {
    this._statusReporte.next(status);
  }
}
