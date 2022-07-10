import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';

@Injectable({
  providedIn: 'root',
})
export class MyPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>) {
    if (window.location.href.includes(KEYWORD_LAYOUT)) {
      return route.data && route.data['preload'] ? load() : of(null);
    } else {
      return of(null);
    }
  }
}
