import { AdobeStockMetadata } from "../types";

/**
 * Generates official Adobe Stock Contributor compliant CSV content.
 * Columns: Filename,Title,Keywords,Category
 */
export function generateAdobeStockCsv(
  items: Array<{
    filename: string;
    metadata: AdobeStockMetadata;
    targetFormat?: "svg" | "eps" | "both";
  }>
): string {
  // Adobe Stock standard header
  const headers = ["Filename", "Title", "Keywords", "Category"];
  const rows: string[] = [headers.join(",")];

  for (const item of items) {
    const meta = item.metadata;
    // Clean and validate title
    const cleanTitle = (meta.title || "Vector artwork commercial design")
      .replace(/"/g, '""')
      .trim();

    // Format keywords: Adobe Stock requires comma-separated keywords
    // We clean each keyword and limit to max 49 (Adobe Stock accepts up to 49)
    const cleanKeywords = (meta.keywords || [])
      .map((k) => k.replace(/[,"]/g, "").trim().toLowerCase())
      .filter((k) => k.length > 1)
      .slice(0, 49)
      .join(", ");

    const categoryId = meta.category >= 1 && meta.category <= 21 ? meta.category : 8; // 8 is Graphic Resources

    // Determine filenames: if "both", produce two rows for .svg and .eps
    const formats = item.targetFormat === "both" ? ["svg", "eps"] : [item.targetFormat || "svg"];

    for (const fmt of formats) {
      const ext = fmt.startsWith(".") ? fmt : `.${fmt}`;
      const baseName = item.filename.replace(/\.(svg|eps|png|jpg)$/i, "");
      const fullFilename = `${baseName}${ext}`;

      // Escape CSV columns
      const row = [
        `"${fullFilename}"`,
        `"${cleanTitle}"`,
        `"${cleanKeywords}"`,
        `${categoryId}`
      ];
      rows.push(row.join(","));
    }
  }

  // Prepend UTF-8 BOM so Excel and Adobe Stock read special characters properly
  return "\uFEFF" + rows.join("\r\n");
}

/**
 * Triggers a browser download of the generated CSV file
 */
export function downloadCsvFile(csvContent: string, filename = "adobe_stock_metadata.csv"): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
