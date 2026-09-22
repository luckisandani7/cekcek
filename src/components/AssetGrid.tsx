import React from "react";
import { Download, Maximize2, Tag, Check, Code, FileText, ExternalLink } from "lucide-react";
import { GeneratedVectorAsset } from "../types";

interface AssetGridProps {
  assets: GeneratedVectorAsset[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPreviewAsset: (asset: GeneratedVectorAsset) => void;
  onDownloadSvg: (asset: GeneratedVectorAsset) => void;
  onDownloadEps: (asset: GeneratedVectorAsset) => void;
  onDownloadPng: (asset: GeneratedVectorAsset) => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPreviewAsset,
  onDownloadSvg,
  onDownloadEps,
  onDownloadPng
}) => {
  if (assets.length === 0) {
    return null;
  }

  const allSelected = assets.length > 0 && selectedIds.length === assets.length;

  return (
    <div className="space-y-4 mb-8">
      {/* Grid header & batch select */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900">
            Karya Vector Dihasilkan ({assets.length})
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            Format EPS-10 & SVG Valid
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="px-2.5 py-1 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium cursor-pointer transition-colors"
          >
            {allSelected ? "Batal Pilih Semua" : "Pilih Semua"}
          </button>
          <span className="text-slate-400">
            ({selectedIds.length} dipilih)
          </span>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((asset, index) => {
          const isSelected = selectedIds.includes(asset.id);
          const baseName = asset.filename.replace(/\.(svg|eps)$/i, "");

          return (
            <div
              key={asset.id}
              className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                isSelected
                  ? "border-blue-500 shadow-md ring-1 ring-blue-500"
                  : "border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md"
              }`}
            >
              {/* Vector visual preview area */}
              <div className="relative aspect-square w-full bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 overflow-hidden">
                {/* Checkered pattern background for vector transparency */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
                    backgroundSize: "16px 16px"
                  }}
                />

                {/* SVG Render */}
                <div
                  className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                  <div className="pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(asset.id)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/90 border-slate-300 hover:border-slate-400 text-transparent"
                      }`}
                      title={isSelected ? "Batalkan pilihan" : "Pilih asset"}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/90 text-slate-700 shadow-xs border border-slate-200">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onPreviewAsset(asset)}
                      className="p-1.5 rounded-md bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs border border-slate-200 cursor-pointer transition-colors"
                      title="Perbesar / Lihat Kode Vector"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Asset Information & Adobe Stock Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-medium text-slate-500 truncate" title={baseName}>
                      {baseName}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                      Kat: {asset.metadata.categoryName} ({asset.metadata.category})
                    </span>
                  </div>

                  <h3
                    className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed"
                    title={asset.metadata.title}
                  >
                    {asset.metadata.title}
                  </h3>
                </div>

                {/* Keywords preview */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5 text-[11px] text-slate-500">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{asset.metadata.keywords.length} Kata Kunci Terkurasi:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {asset.metadata.keywords.slice(0, 4).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
                      >
                        {kw}
                      </span>
                    ))}
                    {asset.metadata.keywords.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        +{asset.metadata.keywords.length - 4} lainnya
                      </span>
                    )}
                  </div>
                </div>

                {/* Download Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDownloadSvg(asset)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Download Scalable Vector Graphics (.svg)"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDownloadEps(asset)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Download Adobe Stock EPS-10 (.eps)"
                  >
                    <Download className="w-3 h-3 text-blue-600" />
                    <span>EPS-10</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDownloadPng(asset)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Download Raster Preview (.png)"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>PNG</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
