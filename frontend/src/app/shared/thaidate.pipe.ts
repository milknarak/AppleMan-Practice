import { Pipe, PipeTransform } from '@angular/core';

const TH_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                         'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

@Pipe({ name: 'thaidate', standalone: true })
export class ThaiDatePipe implements PipeTransform {
  transform(value: Date | string | null | undefined, withTime = false): string {
    if (!value) return '-';
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(+d)) return '-';
    const day = d.getDate();
    const month = TH_MONTHS_SHORT[d.getMonth()];
    const year = (d.getFullYear() + 543).toString().slice(-2);
    let base = `${day} ${month} ${year}`;
    if (withTime) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      base += ` ${hh}:${mm}`;
    }
    return base;
  }
}
