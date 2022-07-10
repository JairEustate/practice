import { Pipe, PipeTransform } from '@angular/core';
import { TimerService } from 'src/app/application/services/timer.service';

@Pipe({
  name: 'formatDate',
})
export class TablesFormatDatePipe implements PipeTransform {
  constructor(private _timer: TimerService) {}

  transform(element: any, format: number = 1): any {
    if (element !== null) {
      if (Date.parse(element)) {
        if (format === 1) {
          return this._timer.formatDate(element, 2);
        }
        if (format === 2) {
          return this._timer.formatDate(element, 3);
        }
      } else {
        return element;
      }
    } else {
      return 'NULL';
    }
  }
}
