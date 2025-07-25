import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'certificado',
    loadChildren: () =>
      import('./features/certificado/certificado.module').then(
        (m) => m.CertificadoModule
      ),
  },
];
