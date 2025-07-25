# Core Services

Este directorio contiene los servicios principales de la aplicación.

## CertificadoService

Servicio para manejar operaciones relacionadas con certificados.

### Métodos disponibles:

#### `uploadCertificado(file: File): Observable<CertificadoResponse>`

Sube un archivo multipart y retorna la respuesta del certificado procesado.

**Ejemplo de uso:**

```typescript
import { CertificadoService, CertificadoResponse } from '../core';

constructor(private certificadoService: CertificadoService) {}

uploadFile(file: File) {
  this.certificadoService.uploadCertificado(file).subscribe({
    next: (response: CertificadoResponse) => {
      console.log('Certificado procesado:', response);
    },
    error: (error) => {
      console.error('Error al procesar certificado:', error);
    }
  });
}
```

#### `getCertificadoById(id: number): Observable<CertificadoResponse>`

Obtiene un certificado específico por su ID.

#### `getAllCertificados(): Observable<CertificadoResponse[]>`

Obtiene todos los certificados disponibles.

#### `downloadCertificadoPdf(id: number): Observable<Blob>`

Descarga el PDF de un certificado específico.

#### `updateCertificadoStatus(id: number, status: string): Observable<CertificadoResponse>`

Actualiza el estado de un certificado.

### Configuración

Asegúrate de que `HttpClient` esté configurado en tu `app.config.ts`:

```typescript
import { provideHttpClient, withFetch } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(withFetch()),
  ],
};
```

### Modelo de respuesta

La respuesta del servicio sigue la estructura definida en `CertificadoResponse`:

```typescript
interface CertificadoResponse {
  id: number;
  code: string;
  name: string;
  maternalLastName: string;
  paternalLastName: string;
  grouping: string;
  certification: string;
  validUntil: string;
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
```

### Configuración del Backend

Por defecto, el servicio apunta a `http://localhost:8080/api`. Puedes cambiar esta URL modificando la propiedad `apiUrl` en el servicio:

```typescript
private readonly apiUrl = 'https://tu-backend.com/api';
```
