import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoDescarga',
  standalone: true
})
export class EstadoDescargaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    switch ((value || '').toUpperCase()) {
      case 'OK':
        return 'COMPLETADO';
      case 'ERROR':
        return 'ERROR';
      case 'PENDIENTE':
        return 'PENDIENTE';
      default:
        return value || '';
    }
  }
}
