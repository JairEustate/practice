import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DEConsecutivo } from '../historia-clinica.forms';
import { TimerService } from 'src/app/application/services/timer.service';
import { ModalService } from 'src/app/application/services/modal.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';
import { StadisticI } from 'src/app/application/interfaces/stadistic.interface';
import { EpicrisisI } from './desconfirmar-epicrisis.interfaces';

@Component({
  selector: 'app-desconfirmar-epicrisis',
  templateUrl: './desconfirmar-epicrisis.component.html',
  styleUrls: ['./desconfirmar-epicrisis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesconfirmarEpicrisis implements OnDestroy {
  public desconfirmando: boolean = false;
  public onConsult: boolean = false;
  public loading: boolean = false;
  public estadisticas!: StadisticI[];

  public myForm = new FormGroup({
    consecutivo: DEConsecutivo,
  });
  get consecutivo(): FormControl {
    return this.myForm.controls.consecutivo as FormControl;
  }

  constructor(
    private _cd: ChangeDetectorRef,
    private _modal: ModalService,
    private _timer: TimerService,
    private _toast: ToastService,
    private _api: ApiService
  ) {}

  public onSubmit(): void {
    this.loading = true;
    const url = `epicrisis/${this.consecutivo.value}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        if (!res.data.length) {
          this._toast.notification('No se encontró epicrisis para desconfirmar');
          this.loading = false;
        } else {
          const epicrisis: EpicrisisI = res.data[0];
          this.estadisticas = [
            { value: 'No. Ingreso', result: epicrisis.Ingreso },
            { value: 'No. Epicrisis', result: epicrisis.Epicrisis },
            {
              value: 'Fecha/hora',
              result: this._timer.formatDate(epicrisis.Fecha, 3),
            },
            { value: 'Documento', result: epicrisis.Documento },
            { value: 'Expedición', result: epicrisis.Expedicion },
            { value: 'Paciente', result: epicrisis.Paciente },
            { value: 'Médico', result: epicrisis.Medico },
            { value: 'Estado', result: epicrisis.Estado },
          ];
          this.loading = false;
          this.onConsult = true;
        }
      } else {
        this.loading = false;
      }
      this._cd.markForCheck();
    });
  }

  public onDesconfirm(): void {
    this._modal
      .confirm('¿desea desconfirmar esta epicrisis?', '¿seguro(a)?')
      .subscribe(async data => {
        if (data) {
          this.desconfirmando = true;
          const url = `epicrisis/desconfirmar/${this.consecutivo.value}`;
          const badMsg = 'No se pudo desconfirmar la epicrisis correctamente';
          this._api.get(url).subscribe(res => {
            if (res.success) {
              this._toast.notification('Epicrisis desconfirmada correctamente');
              setTimeout(() => {
                this.onConsult = false;
                this.desconfirmando = false;
              }, 500);
            } else {
              this._toast.notification(badMsg);
              this.desconfirmando = false;
            }
            this._cd.markForCheck();
          });
        }
      });
  }

  public onCancel(): void {
    this.onConsult = false;
  }

  public ngOnDestroy(): void {
    if (!this.myForm.valid) {
      this.myForm.reset();
    }
  }
}
