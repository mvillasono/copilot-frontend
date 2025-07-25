export interface CertificadoResponse {
  id: number;
  code: string;
  name: string;
  maternalLastName: string;
  paternalLastName: string;
  grouping: string;
  certification: string;
  validUntil: string; // LocalDate se maneja como string en TypeScript
  expired: string;
  pdf: string;
  link: string;
  status: string;
  assignment: string;
  observations: string;
  documentPath: string;
  errorLog: string;
  creationDate: string;
  downloadStatusId: number;
  downloadStatusName: string;
}

export interface UploadCertificadoRequest {
  file: File;
}
