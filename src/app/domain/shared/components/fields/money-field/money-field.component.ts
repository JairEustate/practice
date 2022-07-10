import {
  ChangeDetectorRef,
  Component,
  Optional,
  OnInit,
  Input,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormControl,
  Validators,
  NgControl,
} from '@angular/forms';
import { defaultAppearanceMatForm } from '../fields.common';

@Component({
  selector: 'eda-money-field',
  templateUrl: './money-field.component.html',
  styleUrls: ['./money-field.component.scss'],
})
export class EdaMoneyField implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() appearance: any = defaultAppearanceMatForm;
  @Input() color: string = 'primary';
  @Input() label: string = 'label';
  @Input() hasClearButton: boolean = true;
  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};
  public isInvalid: boolean = false;
  public required: boolean = false;
  public disabled: boolean = false;
  public value: string = '';

  constructor(
    @Self() @Optional() private _control: NgControl,
    @Optional() private _formDirective: FormGroupDirective,
    private cd: ChangeDetectorRef
  ) {
    this._control.valueAccessor = this;
  }

  get control() {
    return this._control.control as FormControl;
  }

  get directive() {
    return this._formDirective as FormGroupDirective;
  }

  get isSubmitted() {
    return this._formDirective ? this._formDirective.submitted : false;
  }

  public ngOnInit(): void {
    this.control?.addValidators(Validators.pattern(/^[0-9.,$]/));
    const form: any = this.control;
    if (form._rawValidators) {
      form._rawValidators.map((r: any) => {
        if (r.name.includes('required')) {
          this.required = true;
        }
      });
    }
  }

  public writeValue(value: string): void {
    if (value === null) {
      this.isInvalid = false;
      this.cd.markForCheck();
    }
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  public onChange(event: any): void {
    this.value = event.target.value;
    this.onChangeFn(event.target.value);
    if (this.control.touched) {
      this._onValidate();
    }
  }

  public setDisabledState(): void {
    this.disabled = true;
  }

  public onFocus(): void {
    if ([null, undefined, ''].indexOf(this.control.value) < 0) {
      const newV = this.control.value
        .toString()
        .replace(/,/g, '')
        .replace(/ /g, '')
        .replace('$', '');
      this.value = newV;
    }
    if ([0, '0'].indexOf(this.control.value) >= 0) {
      this.value = '';
    }
  }

  public onFocusout(): void {
    this.onTouchFn(true);
    if (this.control.valid) {
      if (Number(this.control.value != 0)) {
        if (Number(this.control.value)) {
          if (this.control.value.toString().includes('.')) {
            this.control.setValue(parseFloat(this.control.value).toFixed(2));
          }
          this.value =
            '$ ' + Intl.NumberFormat('en-US').format(Number(this.control.value));
        } else {
          const Split: string[] = this.control.value.split('.');
          const result: string = Split[0] + '.' + Split[1];
          this.control.setValue(parseFloat(result).toFixed(2));
          this.value = '$ ' + Intl.NumberFormat('en-US').format(Number(result));
        }
      } else {
        this.control.setValue(0);
      }
    }
    this._onValidate();
  }

  public onClearControl(): void {
    this.control.setValue('');
    this.value = '';
  }

  private _onValidate(): void {
    if (this.control.invalid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }
}
