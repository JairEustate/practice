import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  constructor() {}


  /**
   * Retorna 0 si el valor recibido es null o undefined
   * @param value 
   * @returns number
   */
  convertNullToZero(value:number){
    if(value === null || value === undefined){
      return 0;
    } else {
      return value;
    }
  }
}
