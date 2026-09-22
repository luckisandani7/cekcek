import React from "react";
import { Sparkles, Layers, BookOpen, UploadCloud, Download, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  assetCount: number;
  onOpenSftpModal: () => void;
  onOpenGuideModal: () => void;
  onDownloadAllZip: () => void;
  isDownloadingZip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  assetCount,
  onOpenSftpModal,
  onOpenGuideModal,
  onDownloadAllZip,
  isDownloadingZip
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">VectorStock AI</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                Adobe Stock Contributor
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Auto Vector Generator (SVG & EPS) • AI Metadata Curator • Bulk Submitter
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide button */}
          <button
            id="btn-header-guide"
            onClick={onOpenGuideModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
            title="Panduan Lengkap Adobe Stock Contributor"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Panduan Kontributor</span>
          </button>

          {/* SFTP Upload modal trigger */}
          <button
            id="btn-header-sftp"
            onClick={onOpenSftpModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Upload SFTP / API</span>
          </button>

          {/* Quick ZIP Export */}
          {assetCount > 0 && (
            <button
              id="btn-header-zip"
              onClick={onDownloadAllZip}
              disabled={isDownloadingZip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloadingZip ? "Mengompres..." : `Download ZIP (${assetCount})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
