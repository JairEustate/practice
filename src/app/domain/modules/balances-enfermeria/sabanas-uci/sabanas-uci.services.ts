import { Injectable } from '@angular/core';
import { StadisticI } from 'src/app/application/interfaces/stadistic.interface';

@Injectable({
  providedIn: 'root',
})
export class SabanasUciService {
  constructor() {}
  /**
   * Agrega horas no registradas en los signos y liquidos suministrados al paciente
   * al momento de presentar la información.
   * @param data
   * @param value
   * @param result
   * @param keyToAutocomplete
   * @returns Stadistic[]
   */
  addUndocumentHours(
    data: any[],
    value: string = 'value',
    result: string = 'result',
    keyToAutocomplete: string = 'hour'
  ): StadisticI[] {
    let newArr: StadisticI[] = [];
    for (let i = 0; i < data.length; i++) {
      newArr.push({
        value: data[i][value],
        result: this.autocompleteHours(data[i][result], keyToAutocomplete),
      });
    }
    return newArr;
  }
  private autocompleteHours(data: any, keyToAutocomplete: string): any {
    let arr: any = [];
    for (let i = 7; i <= 23; i++) {
      let arrFiltered = data.filter((el: any) => el[keyToAutocomplete] === i)[0];
      if (arrFiltered !== undefined) {
        arr.push(arrFiltered);
      } else {
        arr.push({ [keyToAutocomplete]: i });
      }
    }
    for (let i = 0; i <= 6; i++) {
      let arrFiltered = data.filter((el: any) => el[keyToAutocomplete] === i)[0];
      if (arrFiltered !== undefined) {
        arr.push(arrFiltered);
      } else {
        arr.push({ [keyToAutocomplete]: i });
      }
    }
    return arr;
  }
  /**
   * Retorna los subgrupos de liquidos representados como perdida.
   * @returns string[]
   */
  getSubgruposLiquidosPerdidos(): string[] {
    return [
      'ORINA',
      'MATERIA FECAL',
      'EMESIS',
      'DRENAJES',
      'VENTRICULOSTOMIA',
      'ESOFAGOSTOMIA',
      'TUBO PLEURAL DERECHO',
      'TUBO PLEURAL IZQUIERDO',
      'TUBO MEDIASTINAL',
      'GASTROSTOMIA',
      'ILEOSTOMIA',
      'COLOSTOMIA',
      'SONDA VESICAL',
      'SONDA VESICAL DE TRES VÍAS',
      'PENROSE',
      'EXOVAC',
      'DRENAJE POR VACÍO (VAC)',
      'TUBO EN T',
    ];
  }
}
