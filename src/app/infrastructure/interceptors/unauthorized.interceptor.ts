import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar, private _router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if ([401].indexOf(err.status) !== -1) {
          if (window.location.href.includes('session/login')) {
            this._snackBar.open(
              'Usuario no autenticado, nombre y/o contraseña son incorrectos',
              '',
              {
                duration: 3000,
                panelClass: 'snackbar-notification',
              }
            );
          } else {
            localStorage.removeItem('UserName');
            localStorage.removeItem('AuthToken');
            localStorage.removeItem('ContextName');
            this._router.navigate(['session/login']);
          }
        }
        return throwError(() => err);
      })
    );
  }
}
