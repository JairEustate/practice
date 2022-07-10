import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/application/services/api.service';
import { SuggestionI } from 'src/app/application/interfaces/suggestion.interface';
import { contextsE } from 'src/app/application/enums/contexts.enum';
import { appInfoI, appInfo } from 'src/app/app.information';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  app: appInfoI = appInfo;
  Form = new FormGroup({
    connection: new FormControl('ALTA-CENTRO', Validators.required),
    identification: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  authSuccess: boolean = false;
  centrosSuggestions: SuggestionI[] = [
    { value: contextsE.ALTA_CENTRO, option: 'Centro/Alta Complejidad' },
    { value: contextsE.SANJUAN, option: 'San Juan Bautista' },
    { value: contextsE.AMMEDICAL, option: 'AM Medical' },
    { value: contextsE.VALLEDUPAR, option: 'Clínica Valledupar' },
    { value: contextsE.AGUACHICA, option: 'Alta Complejidad Aguachica' },
  ];

  constructor(private _api: ApiService, private _cd: ChangeDetectorRef) {}

  onSubmit(): void {
    if (this.Form.valid) {
      this.authSuccess = true;
      this._api.post(this.Form.value, 'auth/login').subscribe({
        next: res => {
          if (res.success) {
            localStorage.setItem('AuthToken', res.data.datas.token);
            localStorage.setItem('ContextName', this.getContextName());
            localStorage.setItem('UserName', res.data.userinfo[0].user);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            this.authSuccess = false;
            this._cd.markForCheck();
          }
        },
        error: () => {
          this.authSuccess = false;
          this._cd.markForCheck();
        },
      });
    }
  }
  private getContextName(): string {
    return this.centrosSuggestions.filter(
      (element: SuggestionI) => element.value === this.connection.value
    )[0].option;
  }
  get connection(): FormControl {
    return this.Form.controls['connection'] as FormControl;
  }
  get identification(): FormControl {
    return this.Form.controls['identification'] as FormControl;
  }
  get password(): FormControl {
    return this.Form.controls['password'] as FormControl;
  }
}
