import React, { useState } from "react";
import { X, UploadCloud, Key, Server, CheckCircle2, AlertCircle, ExternalLink, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { GeneratedVectorAsset, SftpConfig } from "../types";

interface AdobeStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: GeneratedVectorAsset[];
  selectedIds: string[];
}

export const AdobeStockModal: React.FC<AdobeStockModalProps> = ({
  isOpen,
  onClose,
  assets,
  selectedIds
}) => {
  const [host, setHost] = useState("sftp.contributor.adobestock.com");
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [targetFormat, setTargetFormat] = useState<"svg" | "eps" | "both">("both");
  const [includeCsv, setIncludeCsv] = useState(true);

  // States
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; details?: string[] } | null>(null);

  if (!isOpen) return null;

  const targetAssets = selectedIds.length > 0
    ? assets.filter((a) => selectedIds.includes(a.id))
    : assets;

  const handleTestConnection = async () => {
    if (!username.trim() || !password.trim()) {
      setTestResult({
        success: false,
        message: "Silakan isi Username (ID Contributor) dan Password/Token SFTP Anda."
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/adobestock/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, port, username, password })
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || (data.success ? "Koneksi SFTP Berhasil!" : "Gagal terhubung ke SFTP.")
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Gagal menguji koneksi: ${err.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleUpload = async () => {
    if (!username.trim() || !password.trim()) {
      setUploadResult({
        success: false,
        message: "Username dan Password SFTP wajib diisi untuk mengunggah."
      });
      return;
    }

    if (targetAssets.length === 0) {
      setUploadResult({
        success: false,
        message: "Tidak ada asset yang dipilih untuk diunggah."
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch("/api/adobestock/upload-sftp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sftpConfig: { host, port, username, password },
          assets: targetAssets,
          targetFormat,
          includeCsv
        })
      });
      const data = await res.json();
      setUploadResult({
        success: data.success,
        message: data.message,
        details: data.details
      });
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: `Terjadi kendala saat upload: ${err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Unggah Langsung ke Adobe Stock Contributor
              </h3>
              <p className="text-xs text-slate-500">
                Integrasi SFTP resmi: Mengirim file EPS/SVG & Metadata langsung ke dasbor Adobe Stock
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions banner */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-blue-800">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Cara Mendapatkan Kredensial SFTP Adobe Stock:
              </span>
              <a
                href="https://contributor.stock.adobe.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold underline"
              >
                Buka Adobe Stock Contributor <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-blue-800/90 pl-1">
              <li>Masuk ke dasbor <strong>Adobe Stock Contributor</strong>.</li>
              <li>Klik tab <strong>Unggah (Upload)</strong> lalu pilih opsi <strong>"Unggah via SFTP"</strong>.</li>
              <li>Salin <strong>Nama Pengguna (Username/ID)</strong> dan buat <strong>Kata Sandi / Token SFTP</strong> Anda.</li>
            </ol>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SFTP Host Resmi
                </label>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono">
                  <Server className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <span>{host}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Port
                </label>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono">
                  <span>{port}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username / ID Contributor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: 20984120 atau nama pengguna"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password / SFTP Token <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Token SFTP dari Adobe Stock"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-8"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !username || !password}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {isTesting ? "Menguji Koneksi SFTP..." : "Uji Koneksi SFTP Adobe Stock"}
              </button>

              <span className="text-[11px] text-slate-400">
                Kredensial hanya digunakan di sesi ini dan tidak disimpan di database publik.
              </span>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  testResult.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Upload Options */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Pilihan Format File yang Diunggah
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "both", label: "Keduanya (SVG & EPS)", desc: "Rekomendasi Kontributor" },
                  { id: "svg", label: "Hanya SVG", desc: "Format Ringan Web" },
                  { id: "eps", label: "Hanya EPS-10", desc: "Standar Utama Stock" }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setTargetFormat(fmt.id as any)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      targetFormat === fmt.id
                        ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-500 text-slate-900"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    <div className="font-semibold">{fmt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="chk-include-csv"
                  type="checkbox"
                  checked={includeCsv}
                  onChange={(e) => setIncludeCsv(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-include-csv" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Sertakan file <strong>adobe_stock_metadata.csv</strong> bersama file vektor
                </label>
              </div>
            </div>

            {/* Upload Result */}
            {uploadResult && (
              <div
                className={`p-3.5 rounded-xl text-xs flex flex-col gap-1.5 ${
                  uploadResult.success
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-red-50 text-red-900 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {uploadResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{uploadResult.message}</span>
                </div>
                {uploadResult.details && uploadResult.details.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-emerald-200/60 font-mono text-[11px] text-emerald-800">
                    File terunggah: {uploadResult.details.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Akan mengunggah <strong>{targetAssets.length} karya</strong> ke Adobe Stock
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              id="btn-confirm-sftp-upload"
              type="button"
              onClick={handleUpload}
              disabled={isUploading || targetAssets.length === 0 || !username || !password}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengunggah ke SFTP...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Unggah ke Dasbor Adobe Stock</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
