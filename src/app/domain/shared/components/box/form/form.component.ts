import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'eda-box-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaBoxForm implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() grids: number[] = [12, 10, 8, 3, 8];
  @Input() predefinedGrid: string = '';
  @Input() button: string = 'consultar';
  @Input() hasResetButton!: boolean;
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() formGroup!: FormGroup;
  @Input() loading: boolean = false;
  gridsOnSide: string = '';
  gridPrincipal: string = '';
  trimButtonName: boolean = false;

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formGroup.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this._cd.markForCheck();
    });
    if (!this.name && this.description) {
      this.name = this.description;
      this.description = '';
    }
    let onSide = '';
    let principal = '';
    let counter = 0;
    if (this.predefinedGrid !== '') {
      if (this.predefinedGrid === 'small') {
        this.grids = [8, 6, 4];
      }
      if (this.predefinedGrid === 'medium') {
        this.grids = [12, 10, 8, 6];
      }
      if (this.predefinedGrid === 'big') {
        this.grids = [12];
      }
    }
    this.grids.map((r: number) => {
      if (r % 2) {
        r++;
      }
      if (r >= 1 && r <= 12) {
        if (counter === 0) {
          onSide = `col-${(12 - r) / 2}`;
          principal = `col-${r}`;
        }
        if (counter === 1) {
          onSide = `${onSide} col-sm-${(12 - r) / 2}`;
          principal = `${principal} col-sm-${r}`;
        }
        if (counter === 2) {
          onSide = `${onSide} col-md-${(12 - r) / 2}`;
          principal = `${principal} col-md-${r}`;
        }
        if (counter === 3) {
          onSide = `${onSide} col-lg-${(12 - r) / 2}`;
          principal = `${principal} col-lg-${r}`;
        }
        if (counter === 4) {
          onSide = `${onSide} col-xl-${(12 - r) / 2}`;
          principal = `${principal} col-xl-${r}`;
        }
        if (counter === 5) {
          onSide = `${onSide} col-xxl-${(12 - r) / 2}`;
          principal = `${principal} col-xxl-${r}`;
        }
      }
      counter++;
    });
    this.gridsOnSide = onSide;
    this.gridPrincipal = principal;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
