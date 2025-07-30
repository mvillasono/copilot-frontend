import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CertificadoService } from '../../../core/services/certificado.service';
import { CertificadoResponse } from '../../../core/models/certificado.model';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PdfModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() certificado: CertificadoResponse | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() showToast = new EventEmitter<Toast>();

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf = false;

  constructor(
    private certificadoService: CertificadoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Si el modal se abre y hay un certificado, cargar el PDF
    if (this.isVisible && this.certificado?.documentPath) {
      this.loadPdf();
    }
  }

  ngOnDestroy() {
    this.cleanupPdfUrl();
  }

  ngOnChanges() {
    if (this.isVisible && this.certificado?.documentPath && !this.pdfUrl) {
      this.loadPdf();
    } else if (!this.isVisible) {
      this.cleanupPdfUrl();
    }
  }

  private loadPdf() {
    if (!this.certificado?.documentPath) {
      this.emitToast(
        'error',
        'Error',
        'No hay documento disponible para este certificado'
      );
      return;
    }

    this.isLoadingPdf = true;

    this.certificadoService
      .getPdfPreview(this.certificado.documentPath)
      .subscribe({
        next: (pdfBlob: Blob) => {
          // Limpiar URL anterior si existe
          this.cleanupPdfUrl();

          // Crear URL del blob
          this.pdfUrl = URL.createObjectURL(pdfBlob);

          // Crear URL segura para el iframe
          this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.pdfUrl
          );

          this.isLoadingPdf = false;
          this.emitToast(
            'success',
            'PDF Cargado',
            'El documento se ha cargado correctamente'
          );
        },
        error: (error) => {
          console.error('Error al cargar PDF:', error);
          this.isLoadingPdf = false;
          this.emitToast(
            'error',
            'Error al cargar PDF',
            'No se pudo cargar el documento. Verifique que el archivo existe.'
          );
          this.onCloseModal();
        },
      });
  }

  onCloseModal() {
    this.cleanupPdfUrl();
    this.closeModal.emit();
  }

  onDownloadPdf() {
    if (!this.certificado?.documentPath) {
      this.emitToast(
        'error',
        'Error',
        'No hay documento disponible para descargar'
      );
      return;
    }

    this.certificadoService
      .getPdfPreview(this.certificado.documentPath)
      .subscribe({
        next: (pdfBlob: Blob) => {
          // Crear enlace temporal para descarga
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificado_${
            this.certificado!.code || this.certificado!.id
          }.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          this.emitToast(
            'success',
            'Descarga Exitosa',
            'El certificado se ha descargado correctamente'
          );
        },
        error: (error) => {
          console.error('Error al descargar PDF:', error);
          this.emitToast(
            'error',
            'Error de Descarga',
            'No se pudo descargar el certificado'
          );
        },
      });
  }

  private cleanupPdfUrl() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }
    this.safePdfUrl = null;
  }

  private emitToast(type: Toast['type'], title: string, message: string) {
    const toast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration: 5000,
    };
    this.showToast.emit(toast);
  }

  onOverlayClick(event: Event) {
    // Solo cerrar si se hace clic en el overlay, no en el contenido del modal
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }
}
