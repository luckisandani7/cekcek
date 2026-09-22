import JSZip from "jszip";
import { GeneratedVectorAsset } from "../types";
import { generateAdobeStockCsv } from "./csvGenerator";

/**
 * Creates and triggers a download of a complete ZIP package
 * containing all SVG, EPS files, and the corresponding Adobe Stock CSV.
 */
export async function downloadBatchZip(
  assets: GeneratedVectorAsset[],
  zipFilename = "adobe_stock_vector_batch.zip"
): Promise<void> {
  const zip = new JSZip();

  // Create folders
  const svgFolder = zip.folder("svg");
  const epsFolder = zip.folder("eps");

  const csvItems = assets.map((asset) => ({
    filename: asset.filename,
    metadata: asset.metadata,
    targetFormat: "both" as const
  }));

  const csvContent = generateAdobeStockCsv(csvItems);

  // Add CSV to root
  zip.file("adobe_stock_metadata.csv", csvContent);

  // Add instructions
  const readmeText = `========================================================
ADOBE STOCK CONTRIBUTOR UPLOAD BUNDLE
Generated with VectorStock AI
========================================================

ISI PAKET:
1. /svg/ : Berisi semua file vector berformat SVG W3C valid.
2. /eps/ : Berisi semua file vector berformat EPS-10 kompatibel Adobe Illustrator & Adobe Stock.
3. adobe_stock_metadata.csv : File metadata resmi Adobe Stock (Filename, Title, Keywords, Category).

CARA UPLOAD KE ADOBE STOCK CONTRIBUTOR:
--------------------------------------------------------
METODE 1: UPLOAD MELALUI BROWSER (Dashboard Contributor)
1. Buka https://contributor.stock.adobe.com dan masuk dengan Adobe ID Anda.
2. Klik tombol "Unggah" (Upload) di kanan atas.
3. Drag & drop file .svg atau .eps dari folder zip ini.
4. Setelah file terunggah, klik "Unggah CSV" (Upload CSV) di tab metadata.
5. Pilih file 'adobe_stock_metadata.csv' yang ada di zip ini.
6. Adobe Stock akan otomatis mengisi Judul, Kata Kunci (Keywords), dan Kategori untuk semua gambar!
7. Periksa kembali dan klik "Kirim untuk Peninjauan" (Submit for Review).

METODE 2: UPLOAD SFTP / FTP OTOMATIS
1. Dapatkan kredensial SFTP di Akun Contributor Anda:
   - Host: sftp.contributor.adobestock.com
   - Port: 22
   - Username: [ID Akun Contributor Anda]
   - Password: [Token SFTP Adobe Stock Anda]
2. Unggah file .svg atau .eps langsung ke root direktori SFTP.
3. Anda juga dapat menggunakan tombol "Upload SFTP Adobe Stock" langsung di aplikasi VectorStock AI.

TIPS AGAR LOLOS REVIEW KURATOR ADOBE STOCK:
- Tidak ada teks trademark atau merk dagang pihak ketiga.
- Path vector rapi dan tertutup.
- Kata kunci relevan dan tidak spamming (metadata sudah dioptimalkan oleh VectorStock AI).
`;
  zip.file("README_ADOBE_STOCK_CONTRIBUTOR.txt", readmeText);

  // Add each asset's SVG and EPS
  for (const asset of assets) {
    const baseName = asset.filename.replace(/\.(svg|eps|png|jpg)$/i, "");
    if (svgFolder && asset.svgCode) {
      svgFolder.file(`${baseName}.svg`, asset.svgCode);
    }
    if (epsFolder && asset.epsCode) {
      epsFolder.file(`${baseName}.eps`, asset.epsCode);
    }
  }

  // Generate ZIP file and trigger download
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", zipFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
