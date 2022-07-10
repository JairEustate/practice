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
  FormControl,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { defaultAppearanceMatForm } from '../fields.common';

@Component({
  selector: 'eda-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
})
export class EdaPasswordField implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() appearance: any = defaultAppearanceMatForm;
  @Input() color: string = 'primary';
  @Input() label: string = 'label';
  public onChangeFn = (_: any) => {};
  public onTouchFn = (_: any) => {};
  public isInvalid: boolean = false;
  public decrypted: boolean = false;
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
    if (!this.control.value) {
      this.decrypted = false;
    }
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

  public showPassword(): void {
    if (this.decrypted) {
      this.decrypted = false;
    } else {
      this.decrypted = true;
    }
  }
  private _onValidate(): void {
    if (this.control.invalid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }
}
