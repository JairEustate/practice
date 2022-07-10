import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equals',
})
export class EqualsPipe implements PipeTransform {
  transform(errors: any, error: any, args?: any): any {
    if (!errors) return false;
    const array = Object.keys(errors);
    if (array && array.length > 0) return errors[array[0]] === error;
    return false;
  }
}
