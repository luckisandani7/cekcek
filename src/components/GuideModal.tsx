import React from "react";
import { X, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, HelpCircle, FileCheck } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Panduan Sukses Adobe Stock Contributor
              </h3>
              <p className="text-xs text-slate-500">
                Standar File Vektor, Algoritma Metadata, dan Trik Lolos Review Kurator
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Cara Upload CSV */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              1. Cara Upload File & CSV ke Adobe Stock Contributor
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <p className="font-medium text-slate-800">
                Adobe Stock menerima upload file vektor massal melalui 2 metode:
              </p>
              <div className="space-y-3 pt-1">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <strong className="text-slate-900 block">Metode A: Upload Browser + CSV (Paling Mudah)</strong>
                  <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-600">
                    <li>Buka <a href="https://contributor.stock.adobe.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">contributor.stock.adobe.com</a> dan login.</li>
                    <li>Klik tombol <strong>"Unggah"</strong> (Upload).</li>
                    <li>Tarik dan lepas (drag-and-drop) file <strong>.svg</strong> atau <strong>.eps</strong> yang diunduh dari VectorStock AI.</li>
                    <li>Pada halaman pengeditan metadata, klik tautan <strong>"Unggah CSV"</strong> (Upload CSV).</li>
                    <li>Pilih file <strong>adobe_stock_metadata.csv</strong> yang digenerate oleh VectorStock AI.</li>
                    <li>Semua Judul, Kata Kunci, dan Kategori otomatis terisi seketika tanpa perlu mengetik manual satu per satu!</li>
                  </ol>
                </div>

                <div className="border-l-2 border-blue-500 pl-3">
                  <strong className="text-slate-900 block">Metode B: Upload Otomatis via SFTP</strong>
                  <p className="mt-1 text-slate-600">
                    Gunakan fitur <strong>"Upload SFTP"</strong> di VectorStock AI. Masukkan Username Contributor & Password/Token SFTP Anda. Aplikasi akan langsung mengirim seluruh file SVG/EPS dan CSV ke server Adobe Stock Contributor secara otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Aturan Standar File Vektor Adobe Stock */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              2. Standar Format File Vektor Adobe Stock
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Format EPS-10</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Standar Industri</span>
                </div>
                <p className="text-slate-600">
                  Format Encapsulated PostScript kompatibel Level 2/3. File EPS yang dihasilkan VectorStock AI mengikuti spesifikasi PostScript EPS-10 W3C sehingga dapat dibuka di Adobe Illustrator dan diterima kurasi Adobe Stock.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Format SVG</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Ringan & Tajam</span>
                </div>
                <p className="text-slate-600">
                  Format Scalable Vector Graphics berbasis XML standar W3C. Memiliki viewBox tajam, ukuran file sangat efisien, dan rendering mulus di semua resolusi layar hingga 8K.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Trik Metadata & Algoritma Adobe Stock */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              3. Trik Rahasia Algoritma Metadata Adobe Stock
            </h4>
            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 space-y-2">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>10 Kata Kunci Pertama Sangat Menentukan:</strong> Mesin pencari Adobe Stock memprioritaskan kata kunci urutan 1 sampai 10. VectorStock AI secara otomatis menempatkan kata kunci dengan relevansi tertinggi di awal.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Panjang Judul Ideal 5-10 Kata:</strong> Hindari judul terlalu panjang atau spamming keyword. Judul harus mendeskripsikan subjek secara komersial dalam bahasa Inggris yang luwes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Kata yang Dilarang di Judul:</strong> Jangan menyertakan kata <em>"vector"</em>, <em>"illustration"</em>, <em>"isolated"</em>, <em>"AI"</em>, atau merk dagang pihak ketiga di dalam judul. Sistem kurasi otomatis Adobe Stock memfilter kata-kata tersebut.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Checklist Lolos Review */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              4. Checklist Menghindari Penolakan (Rejection) Kurator
            </h4>
            <div className="space-y-1.5">
              {[
                "Bebas dari logo, nama merek dagang (Apple, Nike, dll.), atau wajah tokoh nyata berhak cipta.",
                "Tidak ada path terbuka liar atau artefak vektor di luar kanvas 800x800.",
                "Palet warna seimbang dan memiliki kontras yang nyaman bagi calon pembeli komersial.",
                "Kategori yang dipilih relevan dengan objek utama karya."
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href="https://helpx.adobe.com/stock/contributor/help/vector-requirements.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Dokumentasi Resmi Adobe Stock Vector Requirements <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
