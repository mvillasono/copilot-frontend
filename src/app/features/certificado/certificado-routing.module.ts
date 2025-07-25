import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCertificadoComponent } from './lista-certificado/lista-certificado.component';
import { CargarCertificadoComponent } from './cargar-certificado/cargar-certificado.component';

const routes: Routes = [
  { path: '', redirectTo: 'lista-certificado', pathMatch: 'full' },
  { path: 'lista-certificado', component: ListaCertificadoComponent },
  { path: 'cargar-certificado', component: CargarCertificadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadoRoutingModule {}

// Este archivo ya no es necesario porque las rutas se consolidaron en app.routes.ts.
