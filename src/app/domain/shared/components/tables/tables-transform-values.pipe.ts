import { Pipe, PipeTransform } from '@angular/core';
import { TimerService } from 'src/app/application/services/timer.service';
import * as value from './tables-transform-values.arrays';

@Pipe({
  name: 'tableTransfromValue',
})
export class TablesTransformValuePipe implements PipeTransform {
  constructor(private _timer: TimerService) {}

  transform(element: any, column: string): any {
    if (element !== null) {
      if (value.isWeight.indexOf(column) >= 0) {
        return `${element} kl(s)`;
      } else if (value.isDate4.indexOf(column) >= 0) {
        return this._timer.formatDate(element, 4);
      } else if (value.isDate5.indexOf(column) >= 0) {
        return this._timer.formatDate(element, 5);
      } else if (value.isDay.indexOf(column) >= 0) {
        return `${element}`;
      } else if (value.isAge.indexOf(column) >= 0) {
        return `${element} año(s)`;
      } else if (value.isPercentage.indexOf(column) >= 0) {
        if (element === 0 || Number.isInteger(element)) {
          return `${element}%`;
        } else {
          return `${element.toFixed(2)}%`;
        }
      } else if (value.isValue.indexOf(column) >= 0) {
        return `${Intl.NumberFormat('en-US').format(Number(element))}`;
      } else {
        return element;
      }
    } else {
      return 'NULL';
    }
  }
}
