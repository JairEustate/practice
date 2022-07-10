import { Validators } from '@angular/forms';

export const required = Validators.required;
export const numeric = Validators.pattern(/^[0-9]+$/);
export const maxLength_10 = Validators.maxLength(10);
