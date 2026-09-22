import React, { useState } from "react";
import { FileSpreadsheet, Download, Copy, Check, UploadCloud, AlertCircle, Info } from "lucide-react";
import { GeneratedVectorAsset, ADOBE_STOCK_CATEGORIES } from "../types";

interface MetadataTableProps {
  assets: GeneratedVectorAsset[];
  onUpdateMetadata: (assetId: string, updatedMeta: any) => void;
  onDownloadCsv: () => void;
  onDownloadAllZip: () => void;
  onOpenSftpModal: () => void;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({
  assets,
  onUpdateMetadata,
  onDownloadCsv,
  onDownloadAllZip,
  onOpenSftpModal
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (assets.length === 0) return null;

  const handleCopyCsv = () => {
    const headers = ["Filename", "Title", "Keywords", "Category"];
    const rows = assets.map((a) => {
      const cleanTitle = (a.metadata.title || "").replace(/"/g, '""');
      const cleanKeywords = (a.metadata.keywords || []).slice(0, 49).join(", ");
      return `"${a.filename}.svg","${cleanTitle}","${cleanKeywords}",${a.metadata.category}`;
    });
    const fullText = [headers.join(","), ...rows].join("\n");
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-12">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Metadata Generator Adobe Stock Contributor
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              CSV Format Standar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Disesuaikan dengan algoritma Adobe Stock: 5-10 kata Title, 35+ keywords terurut prioritas, Kategori ID 1-21
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy CSV */}
          <button
            type="button"
            onClick={handleCopyCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Salin CSV ke Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? "Tersalin!" : "Salin CSV"}</span>
          </button>

          {/* Download CSV */}
          <button
            id="btn-download-csv"
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Adobe Stock</span>
          </button>

          {/* Download Batch ZIP */}
          <button
            id="btn-download-batch-zip"
            type="button"
            onClick={onDownloadAllZip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Batch ZIP</span>
          </button>

          {/* SFTP Upload */}
          <button
            type="button"
            onClick={onOpenSftpModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah SFTP Langsung</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3 w-44">Filename (File Asset)</th>
              <th className="py-3 px-4 min-w-[240px]">Title (Judul Komersial)</th>
              <th className="py-3 px-4 min-w-[280px]">Keywords (Kata Kunci Terurut)</th>
              <th className="py-3 px-4 w-52">Category (Kategori Resmi)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {assets.map((asset, idx) => {
              const isExpanded = expandedId === asset.id;
              const titleWordCount = (asset.metadata.title || "").trim().split(/\s+/).filter(Boolean).length;
              const hasKeywordWarning = asset.metadata.keywords.length < 20;

              return (
                <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Row index */}
                  <td className="py-3 px-3 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Filename */}
                  <td className="py-3 px-3">
                    <div className="font-mono text-xs font-medium text-slate-900 truncate max-w-[160px]" title={asset.filename}>
                      {asset.filename}
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-[10px] px-1 rounded bg-slate-200/70 text-slate-600 font-mono">.svg</span>
                      <span className="text-[10px] px-1 rounded bg-blue-100 text-blue-700 font-mono">.eps</span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={asset.metadata.title}
                      onChange={(e) =>
                        onUpdateMetadata(asset.id, {
                          ...asset.metadata,
                          title: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{titleWordCount} kata (standar: 5-10 kata)</span>
                      {titleWordCount > 12 && (
                        <span className="text-amber-600 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Terlalu panjang
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Keywords */}
                  <td className="py-3 px-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                        {asset.metadata.keywords.slice(0, isExpanded ? 50 : 8).map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              kIdx < 10
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-slate-100 text-slate-600"
                            }`}
                            title={kIdx < 10 ? "Top 10 Priority Keyword" : "Keyword"}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {asset.metadata.keywords.length} keywords (10 pertama berprioritas tinggi)
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : asset.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          {isExpanded ? "Tutup" : "Lihat Semua"}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <select
                      value={asset.metadata.category}
                      onChange={(e) => {
                        const newCatId = Number(e.target.value);
                        const found = ADOBE_STOCK_CATEGORIES.find((c) => c.id === newCatId);
                        onUpdateMetadata(asset.id, {
                          ...asset.metadata,
                          category: newCatId,
                          categoryName: found ? found.name : "Graphic Resources"
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      {ADOBE_STOCK_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.id}. {cat.name} ({cat.nameId})
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      ID Kategori: {asset.metadata.category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Informative footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span>
          <strong>Tips Kurator Adobe Stock:</strong> 10 kata kunci pertama adalah yang paling menentukan di mesin pencari Adobe Stock. File CSV ini 100% cocok saat diunggah pada tab metadata Adobe Stock Contributor.
        </span>
      </div>
    </div>
  );
};
