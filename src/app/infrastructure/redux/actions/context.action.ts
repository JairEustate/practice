import { Action } from '@ngrx/store';

export const ALTA_CENTRO = '[context] ALTA_CENTRO';
export const SANJUAN = '[context] SANJUAN';
export const AMMEDICAL = '[context] AMMEDICAL';
export const VALLEDUPAR = '[context] VALLEDUPAR';
export const AGUACHICA = '[context] AGUACHICA';

export class AltaCentroAction implements Action {
  readonly type = ALTA_CENTRO;
}
export class SanJuanAction implements Action {
  readonly type = SANJUAN;
}
export class AMMedicalAction implements Action {
  readonly type = AMMEDICAL;
}
export class ValleduparAction implements Action {
  readonly type = VALLEDUPAR;
}
export class AguachicaAction implements Action {
  readonly type = AGUACHICA;
}
