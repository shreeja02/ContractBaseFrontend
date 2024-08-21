import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterData'
})
export class FilterDataPipe implements PipeTransform {

  transform(items: any[], value: string, args?: unknown[]): any[] {
    if (!items) {
      return items;
    }

    return items.filter((item) => {
      return (JSON.stringify(item).toLocaleLowerCase()).match(value.trim().toLowerCase())
    })
  }

}
