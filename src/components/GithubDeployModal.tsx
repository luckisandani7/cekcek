import React, { useState } from "react";
import { X, Globe, Check, Copy, Terminal, Github, ExternalLink, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface GithubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubDeployModal: React.FC<GithubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const gitCommands = `# 1. Inisialisasi Git dan Commit
git init
git add .
git commit -m "Deploy VectorStock AI to GitHub Pages"

# 2. Hubungkan ke repository GitHub Anda
git branch -M main
git remote add origin https://github.com/<USERNAME>/<NAMA-REPO>.git
git push -u origin main`;

  const gitUpdateCommands = `git add .
git commit -m "Perbarui alur kerja GitHub Pages"
git push`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Panduan Deploy ke GitHub Pages
              </h3>
              <p className="text-xs text-slate-500">
                Aplikasi siap dideploy gratis dengan GitHub Actions & path aset relatif otomatis
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Status badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-900">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Aplikasi Sudah Dikonfigurasi untuk GitHub Pages!</strong>
              <span className="text-[11px] text-emerald-800">
                File alur kerja <code>.github/workflows/deploy.yml</code>, path aset relatif <code>base: './'</code>, dan penanganan SPA <code>404.html</code> sudah terpasang. Begitu di-push ke GitHub, sistem akan langsung membangun dan menerbitkannya secara otomatis.
              </span>
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              <span>Buat Repository di GitHub</span>
            </div>
            <p className="text-slate-600 pl-7">
              Buka <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5">GitHub &gt; New Repository <ExternalLink className="w-3 h-3" /></a>, beri nama repository (misal: <code>vectorstock-ai</code>), lalu buat repository.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
              <span>Push Kode ke GitHub</span>
            </div>
            <div className="pl-7 space-y-1.5">
              <div className="relative">
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {gitCommands}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy("git", gitCommands)}
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCode === "git" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === "git" ? "Disalin!" : "Salin"}</span>
                </button>
              </div>

              {/* If already pushed before */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Jika repository sudah pernah dibuat/di-push sebelumnya:</span>
                <div className="relative mt-1">
                  <pre className="p-2.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {gitUpdateCommands}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy("update", gitUpdateCommands)}
                    className="absolute top-2 right-2 px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    {copiedCode === "update" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    <span>{copiedCode === "update" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
              <span>Aktifkan GitHub Pages (Pilih GitHub Actions)</span>
            </div>
            <div className="pl-7 space-y-1.5 text-slate-600">
              <ol className="list-decimal list-inside space-y-1">
                <li>Di halaman repository GitHub Anda, klik tab <strong>Settings</strong>.</li>
                <li>Pada menu bilah samping kiri, pilih <strong>Pages</strong>.</li>
                <li>Pada bagian <strong>Build and deployment &gt; Source</strong>, ubah dari <em>"Deploy from a branch"</em> menjadi <strong>"GitHub Actions"</strong>.</li>
                <li>Selesai! Tab <strong>Actions</strong> di repository akan otomatis menjalankan proses build dan website akan tayang di:</li>
              </ol>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px] text-blue-700 font-semibold">
                https://&lt;username&gt;.github.io/&lt;nama-repo&gt;/
              </div>
            </div>
          </div>

          {/* Client-side capability info */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-blue-900 text-[11px] space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Bisa Berjalan 100% Offline & Client-Side di GitHub Pages</span>
            </div>
            <p className="text-blue-800/90">
              Saat diakses di GitHub Pages, generator vektor SVG & EPS, pembuatan CSV Adobe Stock, pratinjau kanvas, serta ekspor arsip ZIP berjalan langsung di browser tanpa memerlukan server backend.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
