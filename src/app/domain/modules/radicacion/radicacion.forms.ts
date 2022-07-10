import { FormControl } from '@angular/forms';
import { required, numeric } from 'src/app/app.validators';

/* reporte-sabanas */
export const RSIngreso = new FormControl('', [required, numeric]);
