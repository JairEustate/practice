import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CentroAtencionI } from '../interfaces/centro-atencion.interface';

export interface CentroAtencionObs {
  wasLoaded: boolean;
  centros: CentroAtencionI[];
}

export interface PermissionsObs {
  wasLoaded: boolean;
  permissions: string[];
}

export interface datasourceObs {
  dataSource: any;
  lastUpdated: any;
  wasLoaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _centroAtencion = new BehaviorSubject<CentroAtencionObs>({
    wasLoaded: false,
    centros: [],
  });
  private _permissions = new BehaviorSubject<PermissionsObs>({
    wasLoaded: false,
    permissions: [],
  });
  private _dataSource = new BehaviorSubject<datasourceObs>({
    dataSource: [],
    lastUpdated: null,
    wasLoaded: false,
  });

  public centroAtencion$ = this._centroAtencion.asObservable();
  public permissions$ = this._permissions.asObservable();
  public dataSource$ = this._dataSource.asObservable();

  public setPermissions(wasLoaded: boolean, permissions: string[]) {
    this._permissions.next({ wasLoaded: wasLoaded, permissions: permissions });
  }
  public setCentroAtencion(CentroAtencion: CentroAtencionObs) {
    this._centroAtencion.next(CentroAtencion);
  }
  setDataSource(
    dataSource: any = [],
    lastUpdated: any = null,
    wasLoaded: boolean = false
  ): void {
    this._dataSource.next({ dataSource, lastUpdated, wasLoaded });
  }
}
