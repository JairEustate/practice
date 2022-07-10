import { Component, Optional, OnInit, Input, Self, AfterViewInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { defaultAppearanceMatForm } from '../fields.common';

@Component({
  selector: 'eda-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
})
export class EdaDateField implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() appearance: any = defaultAppearanceMatForm;
  @Input() color: string = 'primary';
  @Input() label: string = 'Selecciona la Fecha';
  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};
  public isInvalid: boolean = false;
  public required: boolean = false;
  public disabled: boolean = false;
  public value: string = '';

  constructor(
    @Self() @Optional() private _control: NgControl,
    @Optional() private _formDirective: FormGroupDirective
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

  public ngAfterViewInit(): void {
    const isValidDate = Date.parse(this.control.value);
    if (isNaN(isValidDate)) {
      this.control.setValue(null);
    } else {
      this.control.setValue(new Date(this.control.value));
    }
  }

  public ngOnInit(): void {
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

  public onFocusout(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  public onCloseDatePicker(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  private _onValidate(): void {
    const isValidDate = Date.parse(this.control.value);
    if (
      this.control.invalid ||
      ([undefined, null, ''].indexOf(this.control.value) < 0 &&
        this.control.valid &&
        isNaN(isValidDate))
    ) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }
}
