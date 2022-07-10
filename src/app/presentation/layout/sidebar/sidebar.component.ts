import {
  ChangeDetectionStrategy,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  Component,
  Output,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HOME } from 'src/app/app.navigation';
import { SidebarService } from './sidebar.services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss', './sidebar.ng-deep.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements AfterViewInit, OnDestroy {
  @Input() opened: boolean = false;

  @Input() midHidden: boolean = false;

  @Output() hideSidebarEvent: EventEmitter<boolean> = new EventEmitter();

  private _unsubscribe$ = new Subject<void>();

  public hideSidebar: FormControl = new FormControl(true);

  public topInfo = HOME;

  constructor(private _sidebar: SidebarService) {
    this.hideSidebar.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(value => {
      localStorage.setItem('hideSidebar', `${value}`);
      this.hideSidebarEvent.emit(value);
    });
  }

  public ngAfterViewInit(): void {
    this.hideSidebar.setValue(this.midHidden);
    if (this.opened) {
      this._sidebar.toggle();
    }
  }

  public toggleSidebar(): void {
    this._sidebar.toggle();
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
