import { Injectable } from '@angular/core';

export enum Contratos {
  _8001 = '8001',
  _ASMET = '8005 - 8006',
  _8010 = '8010',
  _8009 = '8009',
}

export interface ParametrosAgrupadores {
  contratoSeleccionado: string;
  contrato1: string;
  contrato2: string;
}

@Injectable({
  providedIn: 'root',
})
export class EstadisticoPfgpService {
  public getContratosByContext(context: string, contrato: string): ParametrosAgrupadores {
    let contratoSeleccionado: string = '';
    let contrato1: string = '';
    let contrato2: string = '';
    if (context === 'ALTA-CENTRO') {
      if (contrato === Contratos._8001) {
        contratoSeleccionado = contrato;
        contrato1 = contrato;
        contrato2 = contrato;
      }
      if (contrato === Contratos._ASMET) {
        contratoSeleccionado = Contratos._ASMET;
        contrato1 = '8005';
        contrato2 = '8006';
      }
      if (contrato === Contratos._8010) {
        contratoSeleccionado = Contratos._8010;
        contrato1 = contrato;
        contrato2 = contrato;
      }
      if (contrato === Contratos._8009) {
        contratoSeleccionado = Contratos._8009;
        contrato1 = contrato;
        contrato2 = contrato;
      }
    }
    if (context !== 'ALTA-CENTRO') {
      contratoSeleccionado = contrato;
      contrato1 = contrato;
      contrato2 = contrato;
    }
    return {
      contratoSeleccionado: contratoSeleccionado,
      contrato1: contrato1,
      contrato2: contrato2,
    };
  }

  public getDisponibilidad(data: any, diferenciaConsolidado: any): any {
    if (diferenciaConsolidado !== null) {
      data.map((r: any) => {
        if (r.NContrato === 'ASMET') {
          r.NContrato = '8005 - 8006';
        }
        let difCons = diferenciaConsolidado.filter((m: any) =>
          m.NContrato.includes(r.NContrato)
        );
        if (difCons.length > 0) {
          r.Disponibilidad = difCons[0].Diferencia;
        } else {
          r.Disponibilidad = 0;
        }
      });
      return data;
    } else {
      return data;
    }
  }
}
