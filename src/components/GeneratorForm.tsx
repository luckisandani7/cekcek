import React, { useState } from "react";
import { Sparkles, Sliders, Palette, FileText, Check, Wand2 } from "lucide-react";
import { VECTOR_STYLES, COLOR_PALETTES } from "../types";

interface GeneratorFormProps {
  onGenerate: (options: {
    objectPrompt: string;
    styleId: string;
    paletteId: string;
    count: number;
  }) => void;
  isGenerating: boolean;
  currentProgress?: { current: number; total: number };
}

const SAMPLE_PROMPTS = [
  "Secangkir kopi espresso hangat dengan asap mengepul dan biji kopi berserakan",
  "Peluncuran roket startup bisnis teknologi menuju target pasar global",
  "Set ikon dompet digital, kartu kredit, dan grafik pertumbuhan keuangan",
  "Kucing astronot mengenakan helm antariksa melayang di galaksi",
  "Tanaman hias monstera tropis dalam pot keramik minimalis",
  "Mobil listrik masa depan ramah lingkungan dengan stasiun pengisian daya",
  "Karakter dokter ramah dengan stetoskop dan rekam medis digital"
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  isGenerating,
  currentProgress
}) => {
  const [objectPrompt, setObjectPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("flat-modern");
  const [selectedPalette, setSelectedPalette] = useState("vibrant-modern");
  const [count, setCount] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectPrompt.trim() || isGenerating) return;
    onGenerate({
      objectPrompt: objectPrompt.trim(),
      styleId: selectedStyle,
      paletteId: selectedPalette,
      count
    });
  };

  const handleSelectSample = (sample: string) => {
    setObjectPrompt(sample);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-object-prompt" className="block text-sm font-semibold text-slate-800">
              Ketikkan Objek / Subjek Vector
            </label>
            <span className="text-xs text-slate-400">
              AI akan otomatis membuat variasi gambar vector + metadata Adobe Stock
            </span>
          </div>

          <div className="relative">
            <textarea
              id="input-object-prompt"
              rows={2}
              value={objectPrompt}
              onChange={(e) => setObjectPrompt(e.target.value)}
              placeholder="Contoh: Kopi hangat di cangkir keramik, Kucing astronot luar angkasa, Set ikon bisnis startup..."
              className="w-full px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              disabled={isGenerating}
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="mt-2.5">
            <span className="text-xs text-slate-500 mr-2 font-medium">Inspirasi Populer Stock:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {SAMPLE_PROMPTS.slice(0, 4).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isGenerating}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer truncate max-w-[260px]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1 border-t border-slate-100">
          {/* Vector style selector */}
          <div className="lg:col-span-5 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Gaya Desain Vector
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VECTOR_STYLES.slice(0, 6).map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    disabled={isGenerating}
                    className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500 text-slate-900"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{style.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {style.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color palette selector */}
          <div className="lg:col-span-4 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              Palet Warna Komersial
            </label>
            <div className="space-y-1.5">
              {COLOR_PALETTES.map((pal) => {
                const isSelected = selectedPalette === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setSelectedPalette(pal.id)}
                    disabled={isGenerating}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500 text-slate-900 font-medium"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    <span>{pal.name}</span>
                    <div className="flex items-center gap-1">
                      {pal.hexPreview.slice(0, 4).map((hex, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count & Submit */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="range-count" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Jumlah Gambar
                </label>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs">
                  {count} Vektor
                </span>
              </div>

              <input
                id="range-count"
                type="range"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={isGenerating}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>1 Gambar</span>
                <span>5 Gambar</span>
                <span>10 Gambar</span>
              </div>

              <div className="flex gap-1.5 mt-2">
                {[1, 3, 5, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    disabled={isGenerating}
                    className={`flex-1 py-1 text-xs rounded-md border font-medium cursor-pointer transition-colors ${
                      count === num
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-generate-submit"
              type="submit"
              disabled={isGenerating || !objectPrompt.trim()}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {currentProgress
                      ? `Men-generate ${currentProgress.current}/${currentProgress.total}...`
                      : "Memproses AI Vector & Metadata..."}
                  </span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate {count} Vector & Metadata</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature summary strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Format Output: <strong>SVG</strong> & <strong>EPS-10</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Otomatis <strong>CSV Adobe Stock Contributor</strong>
            </span>
            <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              35-45 Keywords Ter-ranking
            </span>
          </div>
          <span className="text-slate-400">Siap Submit 1-Click ke Adobe Stock</span>
        </div>
      </form>
    </div>
  );
};
