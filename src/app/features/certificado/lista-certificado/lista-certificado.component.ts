import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService } from '../../../core/services/certificado.service';
import { CertificadoResponse } from '../../../core/models/certificado.model';
import { FechaFormatoPipe } from '../../../shared/pipes/fecha-formato.pipe';
import { EstadoDescargaPipe } from '../../../shared/pipes/estado-descarga.pipe';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-lista-certificado',
  templateUrl: './lista-certificado.component.html',
  styleUrls: ['./lista-certificado.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FechaFormatoPipe, EstadoDescargaPipe],
})
export class ListaCertificadoComponent implements OnInit {
  // Math object for template use
  Math = Math;

  // Toast system
  toasts: Toast[] = [];

  // Certificados data
  certificados: CertificadoResponse[] = [];
  isLoading = false;
  searchTerm = '';
  selectedStatus = '';

  // Modal properties
  showUploadModal = false;
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  certificateName = '';
  certificateDescription = '';

  constructor(private certificadoService: CertificadoService) {}

  ngOnInit() {
    this.loadCertificados();
  }

  // Certificados methods
  loadCertificados() {
    this.isLoading = true;
    this.certificadoService.getAllCertificados().subscribe({
      next: (certificados: CertificadoResponse[]) => {
        this.certificados = certificados;
        this.isLoading = false;
        console.log('Certificados cargados:', certificados);
      },
      error: (error) => {
        console.error('Error al cargar certificados:', error);
        this.isLoading = false;
        this.showToast(
          'error',
          'Error',
          'No se pudieron cargar los certificados. Por favor, inténtalo de nuevo.'
        );
      },
    });
  }

  get filteredCertificados() {
    return this.certificados.filter((cert) => {
      const matchesSearch =
        !this.searchTerm ||
        cert.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.certification
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        cert.code?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || cert.downloadStatusName === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'expired':
      case 'expirado':
        return 'bg-red-100 text-red-800';
      case 'expiring':
      case 'por vencer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'EJECUTADO';
      case 'expired':
        return 'Expirado';
      case 'expiring':
        return 'Por vencer';
      default:
        return status || 'Desconocido';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  refreshCertificados() {
    this.loadCertificados();
  }

  // Toast methods
  showToast(
    type: Toast['type'],
    title: string,
    message: string,
    duration: number = 5000
  ) {
    const toast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration,
    };

    this.toasts.push(toast);

    // Auto-remove toast after duration
    setTimeout(() => {
      this.removeToast(toast.id);
    }, duration);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }

  getToastIcon(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getToastClasses(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  getToastIconClasses(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  getInitials(name: string, lastName: string): string {
    const firstInitial = name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  getFullName(certificado: CertificadoResponse): string {
    const parts = [
      certificado.name,
      certificado.paternalLastName,
      certificado.maternalLastName,
    ].filter((part) => part && part.trim() !== '');

    return parts.length > 0 ? parts.join(' ') : 'Sin nombre';
  }

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
      this.showToast(
        'error',
        'Archivo no válido',
        'Tipo de archivo no soportado. Por favor selecciona un archivo CSV válido.'
      );
      return;
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      this.showToast(
        'error',
        'Archivo muy grande',
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
        this.showToast(
          'success',
          '¡Éxito!',
          'Certificado cargado exitosamente'
        );

        // Actualizar la lista de certificados después de cargar uno nuevo
        this.refreshCertificados();
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

        this.showToast('error', 'Error al cargar', errorMessage);
      },
    });
  }
}
