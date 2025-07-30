import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService } from '../../../core/services/certificado.service';
import { CertificadoResponse } from '../../../core/models/certificado.model';

@Component({
  selector: 'app-lista-certificado',
  templateUrl: './lista-certificado.component.html',
  styleUrls: ['./lista-certificado.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ListaCertificadoComponent {
  // Modal properties
  showUploadModal = false;
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  certificateName = '';
  certificateDescription = '';

  constructor(private certificadoService: CertificadoService) {}

  // Modal methods
  openUploadModal() {
    this.showUploadModal = true;
    this.resetForm();
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.resetForm();
  }

  resetForm() {
    this.selectedFile = null;
    this.certificateName = '';
    this.certificateDescription = '';
    this.isDragOver = false;
    this.isUploading = false;
  }

  // Drag and drop methods
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    // Validar tipo de archivo
    const allowedTypes = ['.csv'];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExtension)) {
      alert(
        'Tipo de archivo no soportado. Por favor selecciona un archivo válido.'
      );
      return;
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      alert(
        'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.'
      );
      return;
    }

    this.selectedFile = file;

    // Auto-rellenar el nombre del certificado si está vacío
    if (!this.certificateName) {
      this.certificateName = file.name.substring(0, file.name.lastIndexOf('.'));
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFile() {
    if (!this.selectedFile || !this.certificateName) {
      return;
    }

    this.isUploading = true;

    // Llamar al servicio para subir el certificado
    this.certificadoService.uploadCertificado(this.selectedFile).subscribe({
      next: (response: CertificadoResponse) => {
        console.log('Certificado cargado exitosamente:', response);
        this.isUploading = false;
        this.closeUploadModal();
        alert('Certificado cargado exitosamente!');

        // Aquí podrías emitir un evento o llamar a un método para actualizar la lista
        // this.refreshCertificadosList();
      },
      error: (error) => {
        console.error('Error al cargar el certificado:', error);
        this.isUploading = false;

        // Mostrar mensaje de error más específico
        let errorMessage =
          'Error al cargar el certificado. Por favor, inténtalo de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      },
    });
  }
}
