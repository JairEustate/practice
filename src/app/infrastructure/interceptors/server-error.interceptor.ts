import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if ([500].indexOf(err.status) !== -1) {
          this._snackBar.open('Ha ocurrido un error en el servidor', '', {
            duration: 3000,
            panelClass: 'snackbar-notification',
          });
        }
        return throwError(() => err);
      })
    );
  }
}
