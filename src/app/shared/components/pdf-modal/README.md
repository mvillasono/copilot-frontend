# PDF Modal Component

Este componente se encarga de mostrar una vista previa de documentos PDF en un modal.

## Características

- ✅ Vista previa de PDF en iframe
- ✅ Opción de descarga
- ✅ Enlace para abrir en nueva pestaña
- ✅ Estados de carga y error
- ✅ Gestión automática de URLs de blob
- ✅ Diseño responsivo
- ✅ Emisión de toasts para feedback al usuario

## Uso

```html
<app-pdf-modal [isVisible]="showPdfModal" [certificado]="currentCertificado" (closeModal)="closePdfModal()" (showToast)="onPdfModalToast($event)"></app-pdf-modal>
```

## Inputs

- `isVisible: boolean` - Controla la visibilidad del modal
- `certificado: CertificadoResponse | null` - El certificado del cual mostrar el PDF

## Outputs

- `closeModal: EventEmitter<void>` - Se emite cuando se debe cerrar el modal
- `showToast: EventEmitter<Toast>` - Se emite para mostrar notificaciones toast

## Dependencias

- `CertificadoService` - Para obtener el PDF del servidor
- `DomSanitizer` - Para crear URLs seguras para el iframe
- `CommonModule` - Para directivas básicas de Angular

## Arquitectura

El componente maneja automáticamente:

1. **Carga del PDF**: Al recibir un certificado, solicita el PDF al servicio
2. **Sanitización**: Convierte el blob en una URL segura para el iframe
3. **Cleanup**: Limpia las URLs de blob para evitar memory leaks
4. **Error Handling**: Muestra estados de error y emite toasts apropiados

## Eventos del Ciclo de Vida

- `ngOnInit`: Carga inicial si el modal está visible
- `ngOnChanges`: Reacciona a cambios en las propiedades de entrada
- `ngOnDestroy`: Limpia recursos para evitar memory leaks
