import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    const allowedTypes = ['.pem', '.crt', '.cer', '.p12', '.pfx', '.key'];
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

    // Simulación de carga de archivo
    setTimeout(() => {
      console.log('Archivo cargado:', {
        file: this.selectedFile,
        name: this.certificateName,
        description: this.certificateDescription,
      });

      this.isUploading = false;
      this.closeUploadModal();

      // Aquí podrías agregar lógica para actualizar la lista de certificados
      alert('Certificado cargado exitosamente!');
    }, 2000);
  }
}
