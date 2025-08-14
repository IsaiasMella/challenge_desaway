# DESAWAY – Prueba Técnica (React Native + TypeScript)

> # RESUMEN
>
> - App en **React Native + TypeScript** (Expo) con **formulario validado** (texto, numérico decimal y select).
> - **Generación de PDF** con **2 páginas** (layout cuidado, márgenes, colores, tipografías) y **logo oficial de Desaway** embebido.
> - **Guardado local** de datos (offline-first): al reabrir, el formulario conserva valores.
> - **APK listo** (y video corto de demo).

---

## 🎯 Objetivo

Construir una app móvil que tome datos de un formulario sencillo y genere un **PDF dinámico** con **dos páginas**, estilizado y con el **logo de Desaway**, permitiendo además **guardar y descargar el PDF en el dispositivo**. Opcional implementado: **persistencia local** antes de generar el PDF (modo offline-first).

## 🧩 Funcionalidades clave

- **Formulario** con tres campos:
  - **Nombre completo** (texto, requerido, **mínimo 3 caracteres**)
  - **Toneladas cosechadas** (numérico **con decimales**, requerido, **> 0**)
  - **Tipo de cultivo** (select con ≥ 3 opciones)
- **Validación en tiempo real** con mensajes por campo (no bloquea toda la vista; bloquea la acción de generar PDF si hay errores)
- **Generación de PDF** con:
  - **Dos páginas** y distribución de datos: dos campos en la página 1, el tercero en la página 2
  - **Layout cuidado**: márgenes, paleta, jerarquías tipográficas, espaciados
  - **Logo de Desaway** embebido como imagen
- **Descarga/guardado** del PDF en el teléfono
- **Persistencia local** (opcional implementado):
  - Los datos se guardan antes de generar el PDF y quedan disponibles tras cerrar/abrir la app
- **UX**:
  - Botón primario con estados (enabled/disabled)
  - Errores por campo y placeholders claros
  - Teclado numérico para campos numéricos con soporte a coma/punto decimal según plataforma

## Arquitectura y organización

```
└── 📁src
    └── 📁app
        ├── App.tsx
    └── 📁components
        ├── Card.tsx
        ├── DropdownField.tsx
        ├── PrimaryButton.tsx
        ├── TextInputField.tsx
    └── 📁constants
        ├── form.constants.ts
        ├── pdf.constants.ts
    └── 📁hooks
        ├── useHarvestForm.ts
    └── 📁services
        ├── formStorageService.ts
        ├── PDFDrawingService.ts
        ├── PDFGeneratorService.ts
        ├── PDFSaveService.ts
        ├── PDFUtils.ts
    └── 📁types
        ├── harvest.types.ts
    └── 📁utils
        ├── pdf-io.ts
        └── validation.ts
```

**Criterios**

- **Separación por responsabilidades**: UI en `components`, reglas de negocio en `services`, estado/control en `hooks`
- **Tipado estricto (TS)**: modelos en `types`
- **Servicios puros** (ej.: `PDFGeneratorService` sin depender de UI)

## 🛠️ Stack técnico

- **React Native + TypeScript** (Expo)
- **pdf-lib** para generación de PDF (mantenida, flexible, sin depender de WebViews)
- **expo-file-system** para escritura/almacenamiento de archivos
- **expo-asset** para empaquetar y resolver imágenes (logo)
- **@react-native-picker/picker** para el select (con wrapper de estilos y soporte de ícono personalizado)
- **@react-native-community/netinfo** para detección de conectividad (estrategia strict opt-in)

> **Por qué estas elecciones**
>
> - `pdf-lib` tiene buen soporte y control absoluto del lienzo (coordenadas, tipografías, assets). Evita dependencias descontinuadas como wrappers de impresión/HTML antiguos.
> - `expo-file-system` y `expo-asset` son first‑class en Expo y simplifican empaquetado y acceso a archivos, tanto en dev como en build.
> - El `Picker` oficial garantiza compatibilidad y accesibilidad; el wrapper resuelve estilos e iconos sin hacks frágiles.

## 📝 Detalles de implementación

- **Validación**: simple, explícita y por campo.
  - Nombre: requerido y longitud mínima = 3
  - Toneladas: requerido, **numérico decimal** (acepta `1`, `1.5`, `0.5`), y **> 0**
  - Select: requerido (se evita valor por defecto ambiguo)
- **Teclado numérico** con `keyboardType` adecuado por plataforma
- **Persistencia local**:
  - `LocalStorageService` guarda/lee el estado del formulario
  - Estrategia: guardar **antes** de generar el PDF (para cubrir cierres inesperados)
- **PDF**:
  - Lienzo A4 (pt) con guía de márgenes y grilla
  - Página 1: título + campos 1 y 2; Página 2: campo 3 + pie de página
  - Logo cargado vía `Asset` y embebido como imagen en PDF
  - Exportación a ruta local con nombre versionado (`harvest_<timestamp>.pdf`)

## ▶️ Cómo correr el proyecto (dev)

1. **Requisitos**: Node LTS, `npm` o `pnpm`, **Expo SDK 51+**, Android Studio/iOS Xcode (según plataforma)
2. Instalar dependencias:
   ```bash
   npm install
   # o pnpm install / yarn
   ```
3. Ejecutar en desarrollo (Expo):
   ```bash
   npx expo start
   ```
4. Ejecutar en dispositivo/emulador:
   ```bash
   npx expo run:android
   # o
   npx expo run:ios
   ```

## 📦 Build (APK de prueba)

> Proyecto pensado para **EAS Build**.

- Autenticarse una vez: `npx expo login`
- Compilar **APK** de prueba (perfil de previsualización):
  ```bash
  npx eas build -p android --profile preview
  ```
  > Alternativa local (debug APK): `npx expo run:android --variant debug`

> **Nota:** Por defecto EAS genera AAB para release; un perfil `preview/development` produce APK instalable para QA. El pipeline está preparado para ambos.

## 🔍 Decisiones de diseño y trade-offs

- **pdf-lib vs. HTML-to-PDF**: elegí `pdf-lib` por control y mantenimiento. HTML-to-PDF suele depender de motores WebView y queda más frágil en móvil.
- **Persistencia**: guardado previo a la generación garantiza que ante cierres o reconexiones el usuario no pierde trabajo.
- **Validación por campo** (en vez de validación global): UX más clara y accionable.
- **Icono del Picker**: wrapper propio para controlar apariencia sin "hacks" sobre nativos.

## 🧱 Robustez y DX

- **Errores controlados**: try/catch en servicios, mensajes claros para usuario y logs en dev
- **Código modular**: servicios puros y componentes pequeños facilitan test unitario/e2e
- **Tipado fuerte**: evita errores en integraciones futuras (por ejemplo, sumar API real)

## 🗺️ Roadmap (siguientes 3 posibles mejoras)

1. **Compartir PDF** (Share/Intent)
2. **Temas** (light/dark) y tokens de diseño
3. **i18n** (ES/EN) separando copy de UI

## 🔐 Privacidad y seguridad

- Los datos permanecen **localmente** (no se envían a servidores)
- Persistencia mínima y necesaria para UX; fácil de desactivar o cifrar si el caso de uso lo requiere

## 📁 Entregables

- **Código fuente** (este repo)
- **APK de prueba** (en mail)
- **Video de 1 minuto** con flujo completo (en mail)

---

### Gracias por la oportunidad
