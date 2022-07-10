import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  auth: boolean = window.location.href.includes('session') ? false : true;

  constructor(private _router: Router) {
    this._router.events.subscribe(() => {
      if (window.location.href.includes('session')) {
        this.auth = false;
      } else {
        this.auth = true;
      }
    });
  }
}
