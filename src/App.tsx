import React, { useState } from "react";
import { Header } from "./components/Header";
import { GeneratorForm } from "./components/GeneratorForm";
import { AssetGrid } from "./components/AssetGrid";
import { MetadataTable } from "./components/MetadataTable";
import { AdobeStockModal } from "./components/AdobeStockModal";
import { VectorPreviewModal } from "./components/VectorPreviewModal";
import { GuideModal } from "./components/GuideModal";
import { GeneratedVectorAsset, AdobeStockMetadata } from "./types";
import { convertSvgToEps } from "./utils/epsConverter";
import { generateAdobeStockCsv, downloadCsvFile } from "./utils/csvGenerator";
import { downloadBatchZip } from "./utils/zipExport";
import { Sparkles, Layers, Download, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

// Pre-seeded starter vector assets so user can test immediate downloads and metadata
const INITIAL_ASSETS: GeneratedVectorAsset[] = [
  {
    id: "init_coffee_01",
    filename: "warm_coffee_mug_01",
    prompt: "Secangkir kopi espresso hangat dengan asap mengepul dan biji kopi",
    style: "flat-modern",
    palette: "earthy-organic",
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="coffee_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <linearGradient id="mug_grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#coffee_bg)"/>
  <!-- Saucer plate -->
  <ellipse cx="400" cy="580" rx="220" ry="40" fill="#D97706" opacity="0.25"/>
  <ellipse cx="400" cy="565" rx="190" ry="30" fill="#FFFFFF"/>
  <ellipse cx="400" cy="565" rx="175" ry="24" fill="#FDE68A"/>
  <!-- Ceramic Cup -->
  <path d="M 270 340 L 290 530 C 290 560, 510 560, 510 530 L 530 340 Z" fill="url(#mug_grad)"/>
  <!-- Cup handle -->
  <path d="M 515 370 C 590 370, 590 490, 505 500" fill="none" stroke="#78350F" stroke-width="28" stroke-linecap="round"/>
  <!-- Liquid coffee surface -->
  <ellipse cx="400" cy="345" rx="125" ry="26" fill="#451A03"/>
  <ellipse cx="400" cy="345" rx="100" ry="18" fill="#78350F"/>
  <path d="M 370 345 C 385 335, 415 335, 430 345 C 415 355, 385 355, 370 345 Z" fill="#F59E0B" opacity="0.6"/>
  <!-- Steam lines -->
  <path d="M 350 280 C 330 230, 370 190, 350 140" fill="none" stroke="#D97706" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
  <path d="M 400 270 C 430 220, 380 180, 410 120" fill="none" stroke="#B45309" stroke-width="14" stroke-linecap="round" opacity="0.8"/>
  <path d="M 450 290 C 470 240, 440 200, 460 150" fill="none" stroke="#D97706" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
  <!-- Scattered coffee beans -->
  <ellipse cx="230" cy="590" rx="20" ry="14" fill="#451A03" transform="rotate(-25 230 590)"/>
  <ellipse cx="570" cy="580" rx="18" ry="12" fill="#78350F" transform="rotate(35 570 580)"/>
  <ellipse cx="530" cy="620" rx="16" ry="11" fill="#451A03" transform="rotate(-15 530 620)"/>
</svg>`,
    epsCode: "",
    metadata: {
      filename: "warm_coffee_mug_01",
      title: "Warm Ceramic Coffee Cup with Roasted Beans and Steam",
      keywords: [
        "coffee", "espresso", "mug", "cup", "caffeine", "hot drink", "roasted beans", "breakfast", "cafe", "beverage",
        "ceramic", "aroma", "morning", "steam", "warm", "cappuccino", "latte", "kitchen", "break", "restaurant",
        "table", "refreshment", "energy", "lifestyle", "relax", "minimalist", "design", "graphic", "commercial"
      ],
      category: 4,
      categoryName: "Drinks"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "init_rocket_02",
    filename: "business_rocket_launch_02",
    prompt: "Peluncuran roket bisnis startup teknologi menuju target pasar",
    style: "flat-modern",
    palette: "vibrant-modern",
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="rocket_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
    <linearGradient id="body_grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="flame_grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#rocket_bg)"/>
  <!-- Space clouds & trajectory -->
  <path d="M 150 720 Q 380 620, 420 380" fill="none" stroke="#93C5FD" stroke-width="6" stroke-dasharray="12 8" opacity="0.6"/>
  <!-- Jet Propulsion Flame -->
  <path d="M 370 480 Q 400 660, 400 700 Q 400 660, 430 480 Z" fill="url(#flame_grad)"/>
  <path d="M 385 480 Q 400 580, 400 610 Q 400 580, 415 480 Z" fill="#FDE047"/>
  <!-- Rocket Main Body -->
  <g transform="rotate(45 400 350)">
    <!-- Fins -->
    <path d="M 340 440 L 300 480 L 350 480 Z" fill="#2563EB"/>
    <path d="M 460 440 L 500 480 L 450 480 Z" fill="#2563EB"/>
    <!-- Fuselage -->
    <path d="M 400 180 C 350 250, 350 440, 360 480 L 440 480 C 450 440, 450 250, 400 180 Z" fill="url(#body_grad)"/>
    <!-- Nose cone -->
    <path d="M 400 180 C 375 220, 370 250, 370 270 L 430 270 C 430 250, 425 220, 400 180 Z" fill="#EF4444"/>
    <!-- Porthole Window -->
    <circle cx="400" cy="330" r="32" fill="#3B82F6"/>
    <circle cx="400" cy="330" r="22" fill="#93C5FD"/>
    <circle cx="394" cy="324" r="6" fill="#FFFFFF"/>
    <!-- Booster ring -->
    <rect x="365" y="475" width="70" height="15" rx="4" fill="#334155"/>
  </g>
  <!-- Orbit Stars & Elements -->
  <circle cx="620" cy="220" r="16" fill="#F59E0B"/>
  <circle cx="200" cy="300" r="10" fill="#3B82F6"/>
  <circle cx="650" cy="480" r="8" fill="#10B981"/>
  <circle cx="220" cy="620" r="14" fill="#8B5CF6"/>
</svg>`,
    epsCode: "",
    metadata: {
      filename: "business_rocket_launch_02",
      title: "Modern Rocket Launch Concept for Business Startup Growth",
      keywords: [
        "rocket", "startup", "launch", "business", "growth", "technology", "success", "investment", "space", "progress",
        "innovation", "concept", "mission", "flight", "achievement", "boost", "speed", "development", "financial", "future",
        "strategy", "target", "vision", "commercial", "enterprise", "venture", "market", "professional", "graphic"
      ],
      category: 3,
      categoryName: "Business"
    },
    createdAt: new Date().toISOString()
  }
];

// Initialize EPS for pre-seeded items
INITIAL_ASSETS.forEach((item) => {
  item.epsCode = convertSvgToEps(item.svgCode, {
    title: item.metadata.title,
    keywords: item.metadata.keywords,
    width: 800,
    height: 800
  });
});

export default function App() {
  const [assets, setAssets] = useState<GeneratedVectorAsset[]>(INITIAL_ASSETS);
  const [selectedIds, setSelectedIds] = useState<string[]>(INITIAL_ASSETS.map((a) => a.id));
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number } | undefined>();
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Modals
  const [isSftpModalOpen, setIsSftpModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<GeneratedVectorAsset | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  // Generate batch
  const handleGenerate = async (options: {
    objectPrompt: string;
    styleId: string;
    paletteId: string;
    count: number;
  }) => {
    setIsGenerating(true);
    setCurrentProgress({ current: 1, total: options.count });

    try {
      const response = await fetch("/api/vector/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.assets)) {
        // Prepend new assets
        setAssets((prev) => [...data.assets, ...prev]);
        // Auto-select newly generated assets
        setSelectedIds(data.assets.map((a: any) => a.id));
        showToast(
          `Sukses membuat ${data.assets.length} gambar vektor & metadata Adobe Stock!`,
          "success"
        );
      } else {
        showToast(data.error || "Gagal membuat gambar vektor.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Terjadi kesalahan: ${err.message}`, "error");
    } finally {
      setIsGenerating(false);
      setCurrentProgress(undefined);
    }
  };

  // Select / Deselect
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(assets.map((a) => a.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // Update metadata from table
  const handleUpdateMetadata = (assetId: string, updatedMeta: AdobeStockMetadata) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, metadata: updatedMeta } : a))
    );
  };

  // Individual file downloads
  const handleDownloadSvg = (asset: GeneratedVectorAsset) => {
    const filename = `${asset.filename.replace(/\.(svg|eps)$/i, "")}.svg`;
    const blob = new Blob([asset.svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`File SVG diunduh: ${filename}`, "success");
  };

  const handleDownloadEps = (asset: GeneratedVectorAsset) => {
    const filename = `${asset.filename.replace(/\.(svg|eps)$/i, "")}.eps`;
    const epsText = asset.epsCode || convertSvgToEps(asset.svgCode, {
      title: asset.metadata.title,
      keywords: asset.metadata.keywords
    });
    const blob = new Blob([epsText], { type: "application/postscript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`File EPS-10 diunduh: ${filename}`, "success");
  };

  const handleDownloadPng = (asset: GeneratedVectorAsset) => {
    const filename = `${asset.filename.replace(/\.(svg|eps)$/i, "")}.png`;
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const blob = new Blob([asset.svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1600, 1600);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`File PNG (1600x1600) diunduh: ${filename}`, "success");
    };

    img.src = url;
  };

  // CSV export
  const handleDownloadCsv = () => {
    const targetAssets = selectedIds.length > 0
      ? assets.filter((a) => selectedIds.includes(a.id))
      : assets;

    if (targetAssets.length === 0) {
      showToast("Pilih minimal satu karya untuk di-export ke CSV.", "info");
      return;
    }

    const csvContent = generateAdobeStockCsv(
      targetAssets.map((a) => ({
        filename: a.filename,
        metadata: a.metadata,
        targetFormat: "both"
      }))
    );

    downloadCsvFile(csvContent, `adobe_stock_metadata_${Date.now()}.csv`);
    showToast("File CSV Adobe Stock Contributor berhasil diunduh!", "success");
  };

  // Batch ZIP download
  const handleDownloadAllZip = async () => {
    const targetAssets = selectedIds.length > 0
      ? assets.filter((a) => selectedIds.includes(a.id))
      : assets;

    if (targetAssets.length === 0) {
      showToast("Pilih minimal satu karya untuk di-download ke ZIP.", "info");
      return;
    }

    setIsDownloadingZip(true);
    try {
      await downloadBatchZip(targetAssets, `adobe_stock_batch_${Date.now()}.zip`);
      showToast(
        `Berhasil mengompres dan mengunduh ZIP (${targetAssets.length} karya SVG + EPS + CSV)!`,
        "success"
      );
    } catch (err: any) {
      showToast(`Gagal mengunduh ZIP: ${err.message}`, "error");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 max-w-md ${
              toast.type === "success"
                ? "bg-emerald-900 text-white border-emerald-800"
                : toast.type === "error"
                ? "bg-red-900 text-white border-red-800"
                : "bg-slate-900 text-white border-slate-800"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        assetCount={assets.length}
        onOpenSftpModal={() => setIsSftpModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onDownloadAllZip={handleDownloadAllZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Hero Sub-header */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Generator Gambar Vektor Otomatis & Adobe Stock Submitter
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Ketikkan objek apa pun untuk menghasilkan file vektor <strong>SVG</strong> dan <strong>EPS-10</strong> berkualitas komersial secara massal, lengkap dengan metadata CSV terkurasi otomatis dan integrasi upload langsung ke Adobe Stock Contributor.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Algoritma Adobe Stock 2026 Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Generator Form */}
        <GeneratorForm
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          currentProgress={currentProgress}
        />

        {/* Asset Grid */}
        <AssetGrid
          assets={assets}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onPreviewAsset={(asset) => setPreviewAsset(asset)}
          onDownloadSvg={handleDownloadSvg}
          onDownloadEps={handleDownloadEps}
          onDownloadPng={handleDownloadPng}
        />

        {/* Editable Adobe Stock Metadata Table */}
        <MetadataTable
          assets={assets}
          onUpdateMetadata={handleUpdateMetadata}
          onDownloadCsv={handleDownloadCsv}
          onDownloadAllZip={handleDownloadAllZip}
          onOpenSftpModal={() => setIsSftpModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">VectorStock AI</span>
            <span>•</span>
            <span>Sistem Otomasi Kontributor Adobe Stock</span>
          </div>
          <div>
            <span>Dukungan Format: SVG (W3C), EPS-10 (PostScript L2/3), CSV (UTF-8 BOM)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdobeStockModal
        isOpen={isSftpModalOpen}
        onClose={() => setIsSftpModalOpen(false)}
        assets={assets}
        selectedIds={selectedIds}
      />

      <VectorPreviewModal
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onDownloadSvg={handleDownloadSvg}
        onDownloadEps={handleDownloadEps}
        onDownloadPng={handleDownloadPng}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
