import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { mobileQuery } from 'src/app/app.information';
import { SIDENAV } from 'src/app/app.navigation';
import { ContextState } from 'src/app/infrastructure/redux/reducers/context.reducer';
import { StoreService } from 'src/app/application/services/store.service';
import { SidebarService } from '../sidebar.services';
import { ContextService } from 'src/app/infrastructure/redux/services/context.service';
import { contextsE } from 'src/app/application/enums/contexts.enum';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss', './sidenav.ng-deep.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav implements OnInit, AfterViewInit, OnDestroy {
  @Input() midHidden: boolean = false;

  private _unsubscribe$ = new Subject<void>();

  public sidebarHidden: boolean = false;

  public sideNav = SIDENAV;

  public mobileQuery: MediaQueryList;

  public permissions: string[] = [];

  public context!: contextsE;

  constructor(
    private _rdxStore: Store<ContextState>,
    private _contextService: ContextService,
    private _sidebar: SidebarService,
    private _cd: ChangeDetectorRef,
    private _store: StoreService,
    private _media: MediaMatcher
  ) {
    this.mobileQuery = _media.matchMedia(mobileQuery);
    _rdxStore
      .select('context')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(context => {
        this.context = _contextService.getContext(context);
      });
  }

  public ngOnInit(): void {
    const sidebar: any = document.getElementById('sidebar');
    setTimeout(() => {
      if (
        sidebar.classList.contains('mid-hidden') &&
        !sidebar.classList.contains('active')
      ) {
        this.sidebarHidden = true;
      }
      this._cd.markForCheck();
    }, 100);
    this._getPermissions();
  }

  public ngAfterViewInit(): void {
    this._addRippleEffectToLinks();
    this._subscribeToToggleButton();
  }

  private _addRippleEffectToLinks(): void {
    const buttons: any = document
      .getElementById('sidenav')
      ?.getElementsByTagName('button');
    for (const button of buttons) {
      button.addEventListener('click', (event: any) => {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        circle.classList.add('sidenav');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
          ripple.remove();
        }
        button.appendChild(circle);
      });
    }
  }

  private _subscribeToToggleButton(): void {
    const sidebar: any = document.getElementById('sidebar');
    const toggleButton: any = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', () => {
      if (screen.width > 768) {
        if (sidebar.classList.contains('active')) {
          this.sidebarHidden = false;
        } else {
          this.sidebarHidden = true;
        }
        this._cd.markForCheck();
      }
    });
  }

  public toggleSidebar(): void {
    this._sidebar.toggle();
  }

  private _getPermissions(): void {
    this._store.permissions$.subscribe(data => {
      if (data.wasLoaded) {
        this.permissions = data.permissions;
      }
    });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
