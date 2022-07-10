import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private _router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('AuthToken') !== null) {
      this._router.navigate([`${KEYWORD_LAYOUT}/dashboard`]);
      return false;
    } else {
      return true;
    }
  }
}
