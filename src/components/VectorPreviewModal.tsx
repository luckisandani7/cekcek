import React, { useState } from "react";
import { X, Download, Copy, Check, Code, Eye, FileText, Sun, Moon, Grid } from "lucide-react";
import { GeneratedVectorAsset } from "../types";

interface VectorPreviewModalProps {
  asset: GeneratedVectorAsset | null;
  onClose: () => void;
  onDownloadSvg: (asset: GeneratedVectorAsset) => void;
  onDownloadEps: (asset: GeneratedVectorAsset) => void;
  onDownloadPng: (asset: GeneratedVectorAsset) => void;
}

export const VectorPreviewModal: React.FC<VectorPreviewModalProps> = ({
  asset,
  onClose,
  onDownloadSvg,
  onDownloadEps,
  onDownloadPng
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "svg" | "eps" | "meta">("preview");
  const [bgStyle, setBgStyle] = useState<"checker" | "white" | "dark">("checker");
  const [copiedCode, setCopiedCode] = useState(false);

  if (!asset) return null;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-md">
              {asset.metadata.title}
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {asset.filename}.svg • Kategori: {asset.metadata.categoryName} ({asset.metadata.category})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header navigation & actions */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tab selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("svg")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "svg"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Kode SVG</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eps")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "eps"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kode EPS-10</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("meta")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "meta"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Metadata Stock</span>
            </button>
          </div>

          {/* Quick downloads */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownloadSvg(asset)}
              className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
            <button
              type="button"
              onClick={() => onDownloadEps(asset)}
              className="px-2.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download EPS</span>
            </button>
            <button
              type="button"
              onClick={() => onDownloadPng(asset)}
              className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "preview" && (
            <div className="flex flex-col items-center">
              {/* Background control buttons */}
              <div className="flex items-center gap-2 mb-4 self-end">
                <span className="text-xs text-slate-400 mr-1">Background Canvas:</span>
                <button
                  type="button"
                  onClick={() => setBgStyle("checker")}
                  className={`p-1.5 rounded-md border text-xs cursor-pointer ${
                    bgStyle === "checker" ? "bg-slate-200 border-slate-400 text-slate-900" : "bg-white border-slate-200 text-slate-600"
                  }`}
                  title="Papan Transparan (Checkerboard)"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setBgStyle("white")}
                  className={`p-1.5 rounded-md border text-xs cursor-pointer ${
                    bgStyle === "white" ? "bg-slate-200 border-slate-400 text-slate-900" : "bg-white border-slate-200 text-slate-600"
                  }`}
                  title="Latar Putih Bersih"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setBgStyle("dark")}
                  className={`p-1.5 rounded-md border text-xs cursor-pointer ${
                    bgStyle === "dark" ? "bg-slate-800 border-slate-950 text-white" : "bg-white border-slate-200 text-slate-600"
                  }`}
                  title="Latar Gelap Kontras"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Large Viewport */}
              <div
                className={`relative w-full max-w-lg aspect-square rounded-2xl border flex items-center justify-center p-6 shadow-inner transition-colors ${
                  bgStyle === "dark"
                    ? "bg-slate-900 border-slate-800"
                    : bgStyle === "white"
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-slate-200"
                }`}
                style={
                  bgStyle === "checker"
                    ? {
                        backgroundImage: `radial-gradient(#CBD5E1 1.5px, transparent 1.5px)`,
                        backgroundSize: "20px 20px"
                      }
                    : {}
                }
              >
                <div
                  className="w-full h-full flex items-center justify-center select-none"
                  dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                />
              </div>

              {/* Asset quick details */}
              <div className="mt-6 w-full max-w-lg bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Prompt Objek:</span>
                  <span className="text-slate-900 font-semibold">{asset.prompt}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Dimensi Vektor:</span>
                  <span className="font-mono text-slate-800">800 × 800 px (Scalable Infinity)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Standar EPS:</span>
                  <span className="font-mono text-blue-700 font-semibold">Adobe Stock EPS-10 / PostScript Level 2</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "svg" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Valid W3C Scalable Vector Graphics (SVG XML):
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(asset.svgCode)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Tersalin!" : "Salin Kode SVG"}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
                {asset.svgCode}
              </pre>
            </div>
          )}

          {activeTab === "eps" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700">
                    Encapsulated PostScript EPS-10 (Header & Drawing Primitives):
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Kompatibel dengan Adobe Illustrator, CorelDraw, dan sistem kurasi Adobe Stock
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(asset.epsCode)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Tersalin!" : "Salin Kode EPS"}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-blue-300 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
                {asset.epsCode}
              </pre>
            </div>
          )}

          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Judul Komersial (Title)
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {asset.metadata.title}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Kategori Adobe Stock
                    </label>
                    <span className="text-xs font-medium text-slate-800">
                      {asset.metadata.category}. {asset.metadata.categoryName}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Target File
                    </label>
                    <span className="text-xs font-mono text-slate-800">
                      {asset.filename}.svg / {asset.filename}.eps
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Daftar Kata Kunci Terurut ({asset.metadata.keywords.length} Keywords):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {asset.metadata.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-md border ${
                        i < 10
                          ? "bg-blue-50 text-blue-800 border-blue-200 font-semibold"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 mr-1">#{i + 1}</span>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
