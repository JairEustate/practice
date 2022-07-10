import { ChangeDetectorRef, Component, Optional, Input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { defaultAppearanceMatForm } from '../fields.common';

@Component({
  selector: 'eda-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
})
export class EdaSelectField implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() appearance: any = defaultAppearanceMatForm;
  @Input() color: string = 'primary';
  @Input() label: string = 'label';
  @Input() option: string = 'option';
  @Input() value: string = 'value';
  @Input() suggestions: any = [];
  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};
  public isInvalid: boolean = false;
  public disabled: boolean = false;

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

  public writeValue(value: string): void {
    if (value === null) {
      this.isInvalid = false;
      this.cd.markForCheck();
    }
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  public onChange(event: any): void {
    this.onChangeFn(event.target.value);
    if (this.control.touched) {
      this._onValidate();
    }
  }

  public setDisabledState(): void {
    this.disabled = true;
  }

  public onFocusOut() {
    this._onValidate();
  }
  private _onValidate(): void {
    if (this.control.invalid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }
}
