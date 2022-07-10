import { AfterViewInit, ElementRef, Component, ViewChild, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'eda-custom-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class EdaCustomError implements AfterViewInit {
  @ViewChild('error') error: ElementRef | undefined;
  @Input() control!: FormControl;
  @Input() start!: FormControl;
  @Input() end!: FormControl;
  @Input() isDateField: boolean = false;
  public minLength!: number;
  public maxLength!: number;
  public minLengthMsg: string = `El campo contiene menos caracteres de los requeridos`;
  public maxLengthMsg: string = `El campo contiene mas caracteres de los permitidos`;
  public minMsg: string = `El numero es menor al minimo permitido`;
  public maxMsg: string = `El numero excede el maximo permitido`;
  public patternMsg: string = 'Uno o mas caracteres no permitidos';
  public hasPatternError: boolean = false;
  public requiredMsg: string = 'Este campo es requerido';
  public EmailMsg: string = 'Este campo debe ser un email';
  public badDateMsg: string = 'Inserte una fecha valida';
  public DateRangeMsg: string = 'El rango no es valido';

  get required(): ValidationErrors | null {
    return this.control?.errors?.['required'];
  }
  get pattern(): any {
    return this.control?.errors?.['pattern'];
  }
  get maxlength(): any {
    return this.control?.errors?.['maxlength'];
  }
  get max(): any {
    return this.control?.errors?.['max'];
  }
  get minlength(): any {
    return this.control?.errors?.['minlength'];
  }
  get min(): any {
    return this.control?.errors?.['min'];
  }
  get email(): any {
    return this.control?.errors?.['email'];
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.error?.nativeElement.classList.add('show');
    }, 1);
  }
}
