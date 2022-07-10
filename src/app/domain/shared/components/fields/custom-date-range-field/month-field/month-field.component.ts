import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TimerService } from 'src/app/application/services/timer.service';
import { FormControl } from '@angular/forms';
import { Months, MonthsI } from './months';

@Component({
  selector: 'eda-month-field',
  templateUrl: './month-field.component.html',
  styleUrls: ['../date-range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaMonthField implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef | undefined;
  @Input() formcontrol!: FormControl;
  @Input() label!: string;
  public array: any = Months;
  public month: string = '';

  constructor(
    private _dialog: MatDialog,
    private _timer: TimerService,
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    let valueToCompare: string;
    if (this.formcontrol.value === undefined || this.formcontrol.value === '') {
      valueToCompare = this._timer.currentMonth();
    } else {
      valueToCompare = this.formcontrol.value;
    }
    const lastValue: MonthsI[] = this.array.filter(
      (element: MonthsI) => element.value === valueToCompare
    );
    this.month = lastValue[0].month;
    this.formcontrol.setValue(lastValue[0].value);
    this.input?.nativeElement?.classList.remove('empty');
  }

  public ngAfterViewInit(): void {
    this.input?.nativeElement?.classList.remove('empty');
  }

  /** Abre el modal en el cual debe elegir el mes. */
  public onClick(): void {
    const dialog = this._dialog.open(EdaMonthModal, {
      width: '250px',
    });
    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.formcontrol.setValue(data.value);
        this.month = data.month;
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
  selector: 'eda-month-modal',
  templateUrl: './month-modal.component.html',
  styleUrls: ['../date-range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaMonthModal {
  public array: MonthsI[] = Months;

  constructor(public dialogRef: MatDialogRef<EdaMonthModal>) {}

  public onSelect(item: MonthsI): void {
    this.dialogRef.close({ value: item.value, month: item.month });
  }
}
