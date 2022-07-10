import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CensoCamasService {
  constructor() {}

  /**
   * Calcula el porcentaje de camas ocupadas/desocupadas
   * @param array
   * @returns newArray
   */
  calcPorcCamas(array: any) {
    let newArray: any = [];
    array.map((r: any) => {
      let i = {
        CAMAS: r.CAMAS,
        DESOCUPADAS: r.DESOCUPADAS,
        HGRCODIGO: r.HGRCODIGO,
        HGRNOMBRE: r.HGRNOMBRE,
        OCUPADAS: r.OCUPADAS,
        PORC_OCUPADAS: (r.OCUPADAS * 100) / r.CAMAS,
        PORC_DESOCUPADAS: (r.DESOCUPADAS * 100) / r.CAMAS,
      };
      newArray.push(i);
    });
    return newArray;
  }

  /**
   * Calcula el porcentaje de camas ocupadas/desocupadas
   * @param array
   * @returns newArray
   */
  calcPorcSubgCamas(array: any) {
    let newArray: any = [];
    array.map((r: any) => {
      let i = {
        CAMAS: r.CAMAS,
        DESOCUPADAS: r.DESOCUPADAS,
        HSUCODIGO: r.HSUCODIGO,
        HSUNOMBRE: r.HSUNOMBRE,
        OCUPADAS: r.OCUPADAS,
        PORC_OCUPADAS: (r.OCUPADAS * 100) / r.CAMAS,
        PORC_DESOCUPADAS: (r.DESOCUPADAS * 100) / r.CAMAS,
      };
      newArray.push(i);
    });
    return newArray;
  }
}
