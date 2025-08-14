import { rgb } from "pdf-lib";

// ======= Página (A4 en pt) =======
export const A4_W = 595.28;
export const A4_H = 841.89;

// ======= Layout general =======
export const TITLE_SIZE = 40;
export const TITLE_Y = A4_H - 150;                     // subís/bajás el título
export const LINE_Y  = TITLE_Y - 25;                   // distancia título → línea

// ======= "Sección superior" =======
export const SECTION_W = 380;                         // ← achicá/agrandá el ancho visible
export const SECTION_X = (A4_W - SECTION_W) / 2;      // centrado (si querés desplazar, editá esto)

// Gaps verticales entre línea y header
export const GAP_LINE_TO_SECTION = 25;                // ← gap línea → barra de header
export const HEADER_BAR_H = 44;                       // alto visual del header
export const SECTION_TOP_Y = LINE_Y - GAP_LINE_TO_SECTION; // tope superior del header

// Tipografías
export const SUBTITLE_SIZE = 24;                      // "Información del Reporte"
export const LABEL_SIZE = 20;                         // "Dato 1:"
export const VALUE_SIZE = 20;

 // Ícono del header (PDF.png)
export const ICON_SIZE = 66.7;                        // ← tamaño del icono
export const ICON_OFFSET_X = 8;                       // margen interno a la izquierda
export const ICON_SHIFT_Y = 55;                       // ajuste fino vertical del icono
export const HEADER_GAP = 30;                         // espacio icono ↔ subtítulo
export const SUBTITLE_SHIFT_Y = 10;                   // ajuste fino vertical del subtítulo
 
 // Body (donde van Dato 1/2)
export const LINE_GAP = 50;                            // interlineado general
export const GAP_AFTER_SUBTITLE = LINE_GAP;            // ← MISMO gap subtítulo→Dato1 y Dato1→Dato2
export const BODY_TEXT_EXTRA_INDENT = 0;               // empuja D1/D2 a la derecha si querés
export const BODY_RIGHT_PADDING = 14;                  // margen derecho para wrapping (pág. 2)
 
 // Footer (logo SVG y paginado)
export const FOOTER_LOGO_Y = 150;
export const FOOTER_PAGE_Y = 28;
export const FOOTER_LOGO_WIDTH = 200;                   // <-- tamaño único del logo en ambas páginas
 
export const COLOR_TEXT = rgb(0.30, 0.25, 0.43);        // #4D406E