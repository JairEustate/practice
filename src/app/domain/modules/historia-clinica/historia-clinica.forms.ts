import { FormControl } from '@angular/forms';
import { numeric, required } from 'src/app/app.validators';

/* desconfirmar-epicrisis */
export const DEConsecutivo = new FormControl('', [required, numeric]);
