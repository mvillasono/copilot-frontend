import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificadoRoutingModule } from './certificado-routing.module';
import { ListaCertificadoComponent } from './lista-certificado/lista-certificado.component';
import { CargarCertificadoComponent } from './cargar-certificado/cargar-certificado.component';

@NgModule({
  declarations: [ListaCertificadoComponent, CargarCertificadoComponent],
  imports: [CommonModule, CertificadoRoutingModule],
})
export class CertificadoModule {}
