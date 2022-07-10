import { FormControl } from '@angular/forms';
import { required } from 'src/app/app.validators';

/* registro-jornada-dietas */
export const RJDCentro = new FormControl('', required);
export const RJDFecha = new FormControl('', [required]);
export const RJDJornada_dieta = new FormControl('1', [required]);
export const RJDSubgrupo_cama = new FormControl('', [required]);
