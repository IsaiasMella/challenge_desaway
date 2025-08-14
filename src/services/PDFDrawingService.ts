import { PDFFont, PDFImage, rgb } from "pdf-lib";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import {
  A4_W,
  TITLE_SIZE,
  TITLE_Y,
  LINE_Y,
  SECTION_X,
  SECTION_W,
  COLOR_TEXT,
  SECTION_TOP_Y,
  HEADER_BAR_H,
  ICON_OFFSET_X,
  ICON_SIZE,
  ICON_SHIFT_Y,
  HEADER_GAP,
  SUBTITLE_SIZE,
  SUBTITLE_SHIFT_Y,
  GAP_AFTER_SUBTITLE,
  BODY_TEXT_EXTRA_INDENT,
  LABEL_SIZE,
  VALUE_SIZE,
  FOOTER_LOGO_Y,
  LINE_GAP,
} from "../constants/pdf.constants";

export class PDFDrawingService {
  static drawTitleAndLine(page: any, bold: PDFFont) {
    const title = "Reporte de Datos";
    const tw = bold.widthOfTextAtSize(title, TITLE_SIZE);
    page.drawText(title, {
      x: (A4_W - tw) / 2,
      y: TITLE_Y,
      size: TITLE_SIZE,
      font: bold,
      color: COLOR_TEXT,
    });
    page.drawLine({
      start: { x: SECTION_X, y: LINE_Y },
      end: { x: SECTION_X + SECTION_W, y: LINE_Y },
      thickness: 2,
      color: COLOR_TEXT,
    });
  }
  static drawHeaderAndGetAnchors(page: any, bold: PDFFont, icon?: PDFImage) {
    const headerX = SECTION_X;
    const headerY = SECTION_TOP_Y - HEADER_BAR_H;
    let iconRightX = headerX + ICON_OFFSET_X;

    if (icon) {
      const dims = icon.scaleToFit(ICON_SIZE, ICON_SIZE);
      const iconY = headerY + (HEADER_BAR_H - dims.height) / 2 + ICON_SHIFT_Y;
      page.drawImage(icon, { x: headerX + ICON_OFFSET_X, y: iconY, width: dims.width, height: dims.height });
      iconRightX = headerX + ICON_OFFSET_X + dims.width;
    }

    const subtitle = "Información del Reporte";
    const subX = iconRightX + HEADER_GAP;
    const subY = headerY + (HEADER_BAR_H - SUBTITLE_SIZE) / 2 + SUBTITLE_SHIFT_Y;
    page.drawText(subtitle, { x: subX, y: subY, size: SUBTITLE_SIZE, font: bold, color: COLOR_TEXT });

    const firstLineY = subY - GAP_AFTER_SUBTITLE;
    const textX = subX + BODY_TEXT_EXTRA_INDENT;
    return { textX, firstLineY };
  }

  static async drawHeaderAndGetAnchorsWithSvg(page: any, bold: PDFFont, svgModule: number) {
    const headerX = SECTION_X;
    const headerY = SECTION_TOP_Y - HEADER_BAR_H;
    let iconRightX = headerX + ICON_OFFSET_X;

    if (svgModule) {
      try {
        const iconY = headerY + (HEADER_BAR_H - ICON_SIZE) / 2 + ICON_SHIFT_Y;
        await this.drawSvgPathsFromAsset(page, svgModule, {
          x: headerX + ICON_OFFSET_X,
          y: iconY,
          width: ICON_SIZE,
        });
        iconRightX = headerX + ICON_OFFSET_X + ICON_SIZE;
      } catch (error) {
        console.error("Error dibujando SVG del header:", error);
      }
    }

    const subtitle = "Información del Reporte";
    const subX = iconRightX + HEADER_GAP;
    const subY = headerY + (HEADER_BAR_H - SUBTITLE_SIZE) / 2 + SUBTITLE_SHIFT_Y;
    page.drawText(subtitle, { x: subX, y: subY, size: SUBTITLE_SIZE, font: bold, color: COLOR_TEXT });

    const firstLineY = subY - GAP_AFTER_SUBTITLE;
    const textX = subX + BODY_TEXT_EXTRA_INDENT;
    return { textX, firstLineY };
  }

  static drawLabelValue(
    page: any,
    bold: PDFFont,
    font: PDFFont,
    label: string,
    value: string,
    x: number,
    y: number
  ) {
    page.drawText(label + " ", { x, y, size: LABEL_SIZE, font: bold, color: COLOR_TEXT });
    const lw = bold.widthOfTextAtSize(label + " ", LABEL_SIZE);
    page.drawText(value || "—", { x: x + lw, y, size: VALUE_SIZE, font, color: COLOR_TEXT });
  }

  static drawLabelValueMultiLine(
    page: any,
    bold: PDFFont,
    font: PDFFont,
    label: string,
    valueLines: string[],
    x: number,
    yStart: number,
    lineGap: number
  ) {
    page.drawText(label + " ", { x, y: yStart, size: LABEL_SIZE, font: bold, color: COLOR_TEXT });
    const lw = bold.widthOfTextAtSize(label + " ", LABEL_SIZE);
    page.drawText(valueLines[0], { x: x + lw, y: yStart, size: VALUE_SIZE, font, color: COLOR_TEXT });

    let y = yStart - lineGap;
    for (let i = 1; i < valueLines.length; i++) {
      page.drawText(valueLines[i], { x, y, size: VALUE_SIZE, font, color: COLOR_TEXT });
      y -= lineGap;
    }
  }

  static async drawFooterLogoFromSvg(page: any, svgModule: number, targetWidth: number) {
    try {
      await this.drawSvgPathsFromAsset(page, svgModule, {
        x: (A4_W - targetWidth) / 2,
        y: FOOTER_LOGO_Y,
        width: targetWidth,
      });
    } catch {
    }
  }

  private static async drawSvgPathsFromAsset(
    page: any,
    svgModule: number,
    opts: { x: number; y: number; width: number }
  ) {
    const asset = Asset.fromModule(svgModule);
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error("SVG sin localUri");

    const svg = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    let vbW = 0;
    const vb = svg.match(/viewBox="([^"]+)"/i)?.[1];
    if (vb) {
      const p = vb.trim().split(/\s+/).map(Number);
      vbW = p[2] || 0;
    } else {
      vbW = Number(svg.match(/width="([\d.]+)"/i)?.[1] || 0);
    }
    if (!vbW) vbW = 100;
    const scale = opts.width / vbW;

    const pathRegex = /<path[^>]*d="([^"]+)"[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = pathRegex.exec(svg))) {
      const pathTag = m[0];
      const d = m[1];

      let color: any = null;
      const fillMatch = pathTag.match(/fill="([^"]+)"/i);
      if (fillMatch && fillMatch[1] && fillMatch[1] !== "none") {
        color = this.parseColor(fillMatch[1]);
      }
      if (!color) {
        const strokeMatch = pathTag.match(/stroke="([^"]+)"/i);
        if (strokeMatch && strokeMatch[1] && strokeMatch[1] !== "none") {
          color = this.parseColor(strokeMatch[1]);
        }
      }
      const drawOptions: any = { x: opts.x, y: opts.y, scale };
      if (color) drawOptions.color = color;
      page.drawSvgPath(d, drawOptions);
    }
  }

  private static parseColor(colorStr: string) {
    if (colorStr.startsWith("#")) {
      const hex = colorStr.substring(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16) / 255;
        const g = parseInt(hex[1] + hex[1], 16) / 255;
        const b = parseInt(hex[2] + hex[2], 16) / 255;
        return rgb(r, g, b);
      } else if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return rgb(r, g, b);
      }
    }
    const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]) / 255;
      const g = parseInt(rgbMatch[2]) / 255;
      const b = parseInt(rgbMatch[3]) / 255;
      return rgb(r, g, b);
    }
    return null;
  }
}