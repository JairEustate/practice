import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableValueToCompare',
})
export class TablesValueToComparePipe implements PipeTransform {
  transform(array: any): any {
    if (['Porcentaje'].indexOf(array[1]) >= 0) {
      const value = Math.round(array[0][array[1]]);
      if (value >= 0 && value <= 70) {
        return 'green';
      } else if (value >= 71 && value <= 80) {
        return 'yellow';
      } else if (value >= 81 && value <= 90) {
        return 'orange';
      } else if (value >= 91) {
        return 'red';
      }
    }
    if (
      [
        'Nombre',
        'Can.',
        'Rad.',
        'Anu.',
        'Facturado',
        'Radicable',
        'Radicado',
        '%',
      ].indexOf(array[1]) >= 0
    ) {
      const value: string = array[1];

      if (['Can.', 'Rad.', 'Radicable', '%'].indexOf(value) >= 0) {
        return 2;
      } else if (value === 'Anu.') {
        return 4;
      } else if (value === 'Facturado') {
        return 1;
      } else if (value === 'Radicado') {
        return 3;
      } else if (value === 'Nombre') {
        return 5;
      }
    }
  }
}
