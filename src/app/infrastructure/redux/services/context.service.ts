import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContextState } from '../reducers/context.reducer';
import * as ctxt from '../actions/context.action';
import jwt_decode from 'jwt-decode';
import { contextsE } from 'src/app/application/enums/contexts.enum';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  constructor(private rdxStore: Store<ContextState>) {}

  private _ALTA_CENTRO: string = 'ALTA-CENTRO';
  private _AGUACHICA: string = 'AGUACHICA';
  private _SANJUAN: string = 'SANJUAN';
  private _VALLEDUPAR: string = 'VALLEDUPAR';

  /**
   * Retorna la imagen a usar para la marca de agua en la impresión de documentos.
   * @param context
   * @returns string | null
   */
  public selectMarcaAgua(context: string) {
    if (context === this._ALTA_CENTRO) {
      return 'alta-centro.jpg';
    } else if (context === this._AGUACHICA) {
      return 'aguachica.jpg';
    } else if (context === this._SANJUAN) {
      return 'sanjuan.jpg';
    } else if (context === this._VALLEDUPAR) {
      return 'valledupar.jpg';
    } else {
      return null;
    }
  }
  /**
   * Establece la institución en la cual está autenticandose el usuario.
   * @param context
   */
  public setContext(context: string = '') {
    if (localStorage.getItem('AuthToken') !== null && context === '') {
      const tokenDecoded: any = jwt_decode(localStorage.getItem('AuthToken')!);
      if (tokenDecoded.sub.connection === 'ALTA-CENTRO') {
        this.rdxStore.dispatch(new ctxt.AltaCentroAction());
      }
      if (tokenDecoded.sub.connection === 'SANJUAN') {
        this.rdxStore.dispatch(new ctxt.SanJuanAction());
      }
      if (tokenDecoded.sub.connection === 'AMMEDICAL') {
        this.rdxStore.dispatch(new ctxt.AMMedicalAction());
      }
      if (tokenDecoded.sub.connection === 'VALLEDUPAR') {
        this.rdxStore.dispatch(new ctxt.ValleduparAction());
      }
      if (tokenDecoded.sub.connection === 'AGUACHICA') {
        this.rdxStore.dispatch(new ctxt.AguachicaAction());
      }
    }
  }

  public getContext(context: string): contextsE {
    if (contextsE.AGUACHICA === context) {
      return contextsE.AGUACHICA;
    } else if (contextsE.VALLEDUPAR === context) {
      return contextsE.VALLEDUPAR;
    } else if (contextsE.AMMEDICAL === context) {
      return contextsE.AMMEDICAL;
    } else if (contextsE.SANJUAN === context) {
      return contextsE.SANJUAN;
    } else {
      return contextsE.ALTA_CENTRO;
    }
  }
}
