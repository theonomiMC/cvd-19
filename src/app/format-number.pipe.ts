import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(num: number): string | number {
    // hundreds
  if (num < 1000) {
    return num
  }
  // thousands
  else if (num >= 1000 && num <= 999_999) {
    return Math.floor(num / 1000) + 'K'
  }
  // millions
  else if (num >= 1_000_000 && num <= 999_999_999) {
    return Math.floor(num / 1000_000) + 'M'
  }

  return num
  }

}
