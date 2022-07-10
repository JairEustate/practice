import { FormControl } from '@angular/forms';
import { required, numeric, maxLength_10 } from 'src/app/app.validators';

/* gestion */
export const GResponsable = new FormControl('', [required]);
export const GFecha = new FormControl(new Date(), [required]);
export const GErp = new FormControl('', [required]);
export const GNit = new FormControl('', [numeric]);
export const GContacto = new FormControl('', [required, numeric, maxLength_10]);
export const GVisitaCobro = new FormControl('', [required]);
export const GObservaciones = new FormControl('', [required]);
export const GTipoConciliacion = new FormControl('', required);
export const GFechaConciliacion = new FormControl(null);
/* conciliacion */
export const CEstado = new FormControl('', required);
export const CFechaConciliacion = new FormControl('', required);
export const CIdGestion = new FormControl('', required);
export const CNActaConciliacion = new FormControl('', required);
export const CValorCancelado = new FormControl('', required);
export const CValorConciliado = new FormControl('', required);
export const CValorCuotaModeradora = new FormControl('', required);
export const CValorDeGlosasAceptadaPorIPS = new FormControl('', required);
export const CValorDevuelto = new FormControl('', required);
export const CValorEnAuditoria = new FormControl('', required);
export const CValorEnRetencion = new FormControl('', required);
export const CValorGlosado = new FormControl('', required);
export const CValorNoDescontadoPorEps = new FormControl('', required);
export const CValorNoRadicado = new FormControl('', required);
export const CValorPagoNoAplicado = new FormControl('', required);
export const CValorReconocidoParaPago = new FormControl('', required);
