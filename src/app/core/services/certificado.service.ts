import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertificadoResponse } from '../models/certificado.model';

@Injectable({
  providedIn: 'root',
})
export class CertificadoService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/certified-persons'; // Cambia por tu URL base del backend
  private readonly apiUrlFile = 'http://localhost:8080/api/v1/download'; // Cambia por tu URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo multipart y retorna la respuesta del certificado
   * @param file - Archivo a subir
   * @returns Observable con la respuesta del certificado
   */
  uploadCertificado(file: File): Observable<CertificadoResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Headers para multipart/form-data se establecen automáticamente
    return this.http.post<CertificadoResponse>(
      `${this.apiUrl}/batch`,
      formData
    );
  }

  /**
   * Obtiene un certificado por ID
   * @param id - ID del certificado
   * @returns Observable con la respuesta del certificado
   */
  getCertificadoById(id: number): Observable<CertificadoResponse> {
    return this.http.get<CertificadoResponse>(
      `${this.apiUrl}/certificados/${id}`
    );
  }

  /**
   * Obtiene todos los certificados
   * @returns Observable con array de certificados
   */
  getAllCertificados(): Observable<CertificadoResponse[]> {
    return this.http.get<CertificadoResponse[]>(`${this.apiUrl}`);
  }

  /**
   * Descarga el PDF de un certificado
   * @param id - ID del certificado
   * @returns Observable con el blob del PDF
   */
  downloadCertificadoPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificados/${id}/pdf`, {
      responseType: 'blob',
    });
  }

  /**
   * Actualiza el estado de un certificado
   * @param id - ID del certificado
   * @param status - Nuevo estado
   * @returns Observable con la respuesta actualizada
   */
  updateCertificadoStatus(
    id: number,
    status: string
  ): Observable<CertificadoResponse> {
    return this.http.patch<CertificadoResponse>(
      `${this.apiUrl}/certificados/${id}/status`,
      { status }
    );
  }

  /**
   * Obtiene un preview del PDF usando el documentPath
   * @param documentPath - Ruta del documento en el servidor
   * @returns Observable con el blob del PDF para preview
   */
  getPdfPreview(documentPath: string): Observable<Blob> {
    // Codifica el path para evitar problemas con caracteres especiales
    const encodedPath = encodeURIComponent(documentPath);

    return this.http.get(
      `${this.apiUrlFile}/preview?documentPath=${encodedPath}`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          Accept: 'application/pdf',
        }),
      }
    );
  }

  /**
   * Obtiene una URL segura para el preview del PDF
   * @param documentPath - Ruta del documento en el servidor
   * @returns Observable con la URL temporal del PDF
   */
  getPdfPreviewUrl(documentPath: string): Observable<{ url: string }> {
    const encodedPath = encodeURIComponent(documentPath);

    return this.http.get<{ url: string }>(
      `${this.apiUrl}/preview-url?documentPath=${encodedPath}`
    );
  }
}
