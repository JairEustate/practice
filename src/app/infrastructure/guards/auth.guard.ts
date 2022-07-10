import { Injectable } from "@angular/core";
import { CanActivate, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router) {}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem("AuthToken") === null) {
      this._router.navigate(["session/login"]);
      return false;
    } else {
      return true;
    }
  }
}
