import { PDFDocument, StandardFonts } from "pdf-lib";
import { HarvestData } from "../types/harvest.types";
import { PDFSaveService } from "./PDFSaveService";
import { PDFDrawingService } from "./PDFDrawingService";
import { PDFUtils } from "./PDFUtils";
import {
  LINE_GAP,
  A4_W,
  A4_H,
  FOOTER_LOGO_WIDTH,
  BODY_RIGHT_PADDING,
  SECTION_W,
  SECTION_X,
  VALUE_SIZE,
  FOOTER_PAGE_Y,
  COLOR_TEXT,
} from "../constants/pdf.constants";

export class PDFGeneratorService {
  static async generateHarvestPDF(
    data: HarvestData
  ): Promise<{ fileName: string; location: string; fullPath: string }> {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const pdfIconSvg = require("../../assets/PDF.svg");

    const p1 = pdf.addPage([A4_W, A4_H]);
    PDFDrawingService.drawTitleAndLine(p1, bold);
    
    const a1 = await PDFDrawingService.drawHeaderAndGetAnchorsWithSvg(
      p1,
      bold,
      pdfIconSvg
    );
    
    let y = a1.firstLineY;
    PDFDrawingService.drawLabelValue(p1, bold, font, "Nombre:", data.full_name, a1.textX, y);
    y -= LINE_GAP;
    PDFDrawingService.drawLabelValue(p1, bold, font, "Cosecha:", data.crop, a1.textX, y);

    await PDFDrawingService.drawFooterLogoFromSvg(
      p1,
      require("../../assets/desaway_black_2.svg"),
      FOOTER_LOGO_WIDTH
    );

    const p2 = pdf.addPage([A4_W, A4_H]);
    PDFDrawingService.drawTitleAndLine(p2, bold);
    
    const a2 = await PDFDrawingService.drawHeaderAndGetAnchorsWithSvg(
      p2,
      bold,
      pdfIconSvg
    );
    
    const textWidthForWrap = SECTION_X + SECTION_W - BODY_RIGHT_PADDING - a2.textX;
    const tons = data.tons || 0;
    const lines = PDFUtils.wrapByWidth(tons?.toString(), font, VALUE_SIZE, textWidthForWrap);
    y = a2.firstLineY;
    
    if (lines.length <= 1) {
      PDFDrawingService.drawLabelValue(
        p2,
        bold,
        font,
        "Toneladas cosechadas:",
        lines[0] ?? String(tons),
        a2.textX,
        y
      );
    } else {
      PDFDrawingService.drawLabelValueMultiLine(
        p2,
        bold,
        font,
        "Toneladas cosechadas:",
        lines,
        a2.textX,
        y,
        LINE_GAP
      );
    }

    await PDFDrawingService.drawFooterLogoFromSvg(
      p2,
      require("../../assets/desaway_black_2.svg"),
      FOOTER_LOGO_WIDTH
    );

    const pages = pdf.getPages();
    const total = pages.length;
    pages.forEach((page, i) => {
      const label = `${i + 1}/${total}`;
      const w = font.widthOfTextAtSize(label, 10);
      page.drawText(label, {
        x: (A4_W - w) / 2,
        y: FOOTER_PAGE_Y,
        size: 12,
        font,
        color: COLOR_TEXT,
      });
    });

    const ts = PDFUtils.timestamp();
    const cleanName = (data.full_name || "sin_nombre").replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `harvest_${cleanName}_${ts}.pdf`;
    const base64 = await pdf.saveAsBase64({ dataUri: false });

    return await PDFSaveService.savePDF(base64, fileName);
  }
}