import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/application/services/store.service';

@Injectable({
  providedIn: 'root',
})
export class PermisionsGuard implements CanActivate {
  private _permissions: string[] = [];
  constructor(private _router: Router, private _store: StoreService) {
    const gettingPermissions = this._store.permissions$.subscribe(data => {
      if (data.wasLoaded) {
        this._permissions = data.permissions;
      }
    });
    setTimeout(() => {
      gettingPermissions.unsubscribe();
    }, 20000);
  }
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._permissions.indexOf(route.data['permission']) >= 0) {
      return true;
    } else {
      this._router.navigate(['dashboard']);
      return false;
    }
  }
}
