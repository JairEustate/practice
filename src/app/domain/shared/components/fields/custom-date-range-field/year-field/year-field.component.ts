import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimerService } from 'src/app/application/services/timer.service';
import { YearsService } from './years.service';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'eda-year-field',
  templateUrl: './year-field.component.html',
  styleUrls: ['../date-range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaYearField implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef | undefined;
  @Input() formcontrol!: FormControl | any;
  @Input() label!: string;

  constructor(
    private _dialog: MatDialog,
    private _timer: TimerService,
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    if (this.formcontrol.value === undefined || this.formcontrol.value === '') {
      this.formcontrol.setValue(this._timer.currentYear());
      this.input?.nativeElement?.classList.remove('empty');
    }
  }

  public ngAfterViewInit(): void {
    this.input?.nativeElement?.classList.remove('empty');
  }

  /** Abre el modal en el cual debe elegir el año. */
  public onClick(): void {
    const dialog = this._dialog.open(EdaYearModal, {
      width: '250px',
    });
    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.formcontrol.setValue(data);
        this.input?.nativeElement?.classList.remove('empty');
        this._cd.markForCheck();
      }
    });
  }

  /** Remueve el foco del input, haciendo que no se pueda escribir en el. */
  public onFocus(): void {
    this.input?.nativeElement.blur();
  }
}
/**------------------------------------------------------------------------------*/
/**------------------------------------------------------------------------------*/
@Component({
  selector: 'eda-year-modal',
  templateUrl: './year-modal.component.html',
  styleUrls: ['../date-range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaYearModal implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private lastYear: number = 1990; // Antiguedad Maxima
  array: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EdaYearModal>,
    private _timer: TimerService,
    private svc: YearsService
  ) {}

  ngOnInit(): void {
    this.svc.years$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data.length) {
        this.array = data;
      } else {
        this.array = this.getYears(this._timer.currentYear());
      }
    });
  }

  onSelect(item: string): void {
    this.dialogRef.close(item);
  }

  private getYears(actualYear: string) {
    let years = [];
    for (let i = parseInt(actualYear); i >= this.lastYear; i--) {
      years.push(i.toString());
    }
    this.svc.setYears(years);
    return years;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
