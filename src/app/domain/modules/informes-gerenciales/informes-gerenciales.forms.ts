import { FormControl, Validators } from '@angular/forms';

const required = Validators.required;
/* estadistico-pfgp */
export const EPInicioReporte = new FormControl(null, [required]);
export const EPFinalReporte = new FormControl(null, [required]);
/* facturacion-periodo */
export const FPInicioReporte = new FormControl('', [required]);
export const FPFinalReporte = new FormControl('', [required]);
/* estadistico-radicacion */
export const ERInicioReporte = new FormControl('', [required]);
export const ERFinalReporte = new FormControl('', [required]);
