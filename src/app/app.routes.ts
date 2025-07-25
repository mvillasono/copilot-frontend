import { Routes } from '@angular/router';
import { ListaCertificadoComponent } from './features/certificado/lista-certificado/lista-certificado.component';
import { CargarCertificadoComponent } from './features/certificado/cargar-certificado/cargar-certificado.component';

export const routes: Routes = [
  { path: '', redirectTo: 'certificado', pathMatch: 'full' },
  {
    path: 'certificado',
    children: [
      { path: 'lista-certificado', component: ListaCertificadoComponent },
      { path: 'cargar-certificado', component: CargarCertificadoComponent },
    ],
  },
];
