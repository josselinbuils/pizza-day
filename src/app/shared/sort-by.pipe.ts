import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sortBy'})
export class SortByPipe implements PipeTransform {
  transform(array: Array<any>, sortField: string): Array<any> {
    return array.sort((a: any, b: any) => {

      if (typeof a === 'object' && a[sortField] !== undefined) {
        a = a[sortField];
        b = b[sortField];
      }

      return a < b ? -1 : (a > b ? 1 : 0);
    });
  }
}
