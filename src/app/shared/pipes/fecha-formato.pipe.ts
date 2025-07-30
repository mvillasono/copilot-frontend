import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormato',
  standalone: true
})
export class FechaFormatoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      // Soporta formato 'dd-MM-yyyy HH:mm:ss'
      const match = value.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        // dd-MM-yyyy HH:mm:ss
        const [ , day, month, year, hour, minute, second ] = match;
        date = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute),
          Number(second)
        );
      } else {
        // Intenta parsear con Date por defecto
        date = new Date(value);
      }
    } else {
      return '';
    }
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
