import { FormControl } from '@angular/forms';
import { required, numeric } from 'src/app/app.validators';

/* sabanas-uci */
export const SUIngreso = new FormControl('', [required, numeric]);
export const SUFecha = new FormControl('', required);
