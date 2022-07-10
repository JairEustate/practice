import { Action } from '@ngrx/store';
import * as ctxt from '../actions/context.action';

export interface ContextState {
  context: string;
}

export function ContextReducer(context: string = '', action: Action) {
  switch (action.type) {
    case ctxt.ALTA_CENTRO:
      return (context = 'ALTA-CENTRO');
    case ctxt.AMMEDICAL:
      return (context = 'AMMEDICAL');
    case ctxt.SANJUAN:
      return (context = 'SANJUAN');
    case ctxt.VALLEDUPAR:
      return (context = 'VALLEDUPAR');
    case ctxt.AGUACHICA:
      return (context = 'AGUACHICA');
    default:
      return context;
  }
}
