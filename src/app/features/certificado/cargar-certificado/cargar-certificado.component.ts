import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService, CertificadoResponse } from '../../../core';

@Component({
  selector: 'app-cargar-certificado',
  templateUrl: './cargar-certificado.component.html',
  styleUrls: ['./cargar-certificado.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CargarCertificadoComponent {
  private certificadoService = inject(CertificadoService);

  selectedFile: File | null = null;
  isUploading = false;
  uploadResult: CertificadoResponse | null = null;
  errorMessage: string | null = null;

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  uploadCertificado(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona un archivo';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.uploadResult = null;

    this.certificadoService.uploadCertificado(this.selectedFile).subscribe({
      next: (response: CertificadoResponse) => {
        this.uploadResult = response;
        this.isUploading = false;
        console.log('Certificado subido exitosamente:', response);
      },
      error: (error) => {
        this.errorMessage =
          'Error al subir el certificado: ' +
          (error.message || 'Error desconocido');
        this.isUploading = false;
        console.error('Error:', error);
      },
    });
  }

  resetForm(): void {
    this.selectedFile = null;
    this.uploadResult = null;
    this.errorMessage = null;
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
