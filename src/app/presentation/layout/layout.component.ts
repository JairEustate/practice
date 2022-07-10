import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/application/services/api.service';
import { StoreService } from 'src/app/application/services/store.service';
import { ContextService } from 'src/app/infrastructure/redux/services/context.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements OnInit, OnDestroy {
  /** Indica si el sidebar iniciará abierto o cerrado. */
  public opened: boolean = true;
  /** Indica si el sidebar tendrá la clase mid-hidden. */
  public midHidden: boolean = false;

  constructor(
    private _context: ContextService,
    private _cd: ChangeDetectorRef,
    private _store: StoreService,
    private _api: ApiService,
    private _contextService: ContextService,
    private _title: Title
  ) {}

  public ngOnInit(): void {
    this._title.setTitle('Eklipse | Dashboard');
    this._context.setContext();
    this._getCentros();
    this._getPermits();
    this._contextService.setContext();
    document.getElementById('body')?.classList.add('overflow-y-hidden');
    document.getElementById('body')?.classList.add('layout');
    if (localStorage.getItem('hideSidebar') !== null) {
      if (localStorage.getItem('hideSidebar') === 'true') {
        this.midHidden = true;
      } else {
        this.midHidden = false;
      }
    }
  }

  public onHideSidebar(event: boolean): void {
    const sidebar: any = document.getElementById('sidebar');
    if (event && sidebar?.classList.contains('mid-hidden')) {
      const hideOnSidebarClosed: any = document.getElementsByClassName(
        'hide-on-sidebar-closed'
      );
      for (let i = 0; i < hideOnSidebarClosed.length; i++) {
        hideOnSidebarClosed[i].classList.remove('hidden');
      }
    }
    this.midHidden = event;
    this._cd.markForCheck();
  }

  private _getCentros(): void {
    this._api.get(`center-of-attention`).subscribe(res => {
      if (res.success) {
        this._store.setCentroAtencion({
          wasLoaded: true,
          centros: res.data,
        });
      }
    });
  }

  private _getPermits(): void {
    this._api.get(`permissions`).subscribe(res => {
      if (res.success) {
        const permissions: string[] = res.data;
        const permissionsByModule: string[] = [];
        permissions.map((r: string) => {
          if (permissionsByModule.length === 0) {
            permissionsByModule.push(`${r.slice(0, 2)}00`);
          } else {
            if (permissionsByModule.indexOf(`${r.slice(0, 2)}00`) < 0) {
              permissionsByModule.push(`${r.slice(0, 2)}00`);
            }
          }
        });
        this._store.setPermissions(true, permissions.concat(permissionsByModule));
      }
    });
  }

  public ngOnDestroy(): void {
    document.getElementById('body')?.classList.remove('overflow-y-hidden');
    document.getElementById('body')?.classList.remove('layout');
  }
}
