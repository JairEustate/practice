import { FormControl } from '@angular/forms';
import { required, numeric } from 'src/app/app.validators';

/* conceptos-admision */
export const CAIngreso = new FormControl('', [required, numeric]);
export const CAConceptoFacturacion = new FormControl(12);
