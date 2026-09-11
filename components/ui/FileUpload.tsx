"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  uploadFile,
  validateFile,
  formatFileSize,
  type UploadFolder,
  type UploadResult,
} from "@/lib/upload";

interface FileUploadProps {
  folder?: UploadFolder;
  accept?: string;            // e.g. "image/*,application/pdf"
  maxSizeMB?: number;
  allowPdf?: boolean;
  allowImages?: boolean;
  label?: string;
  hint?: string;
  value?: string;             // current URL (if editing existing)
  onChange?: (url: string, result: UploadResult) => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  folder = "general",
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  allowPdf = true,
  allowImages = true,
  label = "Upload File",
  hint,
  value,
  onChange,
  onRemove,
  className = "",
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUrl = uploadedResult?.url || value;
  const isImage = currentUrl
    ? /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(currentUrl) || uploadedResult?.resourceType === "image"
    : false;
  const isPdf = currentUrl
    ? /\.pdf(\?.*)?$/i.test(currentUrl) || uploadedResult?.format === "pdf"
    : false;

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const validation = validateFile(file, { maxSizeMB, allowPdf, allowImages });
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const result = await uploadFile(file, folder, setProgress);
        setUploadedResult(result);
        onChange?.(result.url, result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, maxSizeMB, allowPdf, allowImages, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset so same file can be re-uploaded
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setUploadedResult(null);
    setError(null);
    onRemove?.();
  };

  const handleCopyUrl = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
      )}

      {/* Drop Zone */}
      {!currentUrl && (
        <motion.div
          whileHover={!disabled ? { borderColor: "rgba(20,184,160,0.5)" } : {}}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={disabled ? undefined : handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer p-6
            ${isDragging ? "border-teal-500/70 bg-teal-500/5" : "border-white/10 bg-white/3 hover:bg-white/5"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${uploading ? "pointer-events-none" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || uploading}
          />

          {uploading ? (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin flex-shrink-0" />
                Uploading file...
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                />
              </div>
              <p className="text-xs text-neutral-500 text-right">{progress}%</p>
            </div>
          ) : (
            <>
              {/* Upload icon */}
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-sm text-white font-medium">
                  {isDragging ? "Drop to upload" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {hint || `${allowImages ? "Images (JPG, PNG, WebP)" : ""}${allowImages && allowPdf ? " · " : ""}${allowPdf ? "PDF" : ""} · Max ${maxSizeMB}MB`}
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-start gap-2"
          >
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd"/></svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Preview of uploaded file */}
      <AnimatePresence>
        {currentUrl && showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="rounded-xl border border-teal-500/20 bg-teal-500/5 overflow-hidden"
          >
            {/* Image preview */}
            {isImage && (
              <div className="relative bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUrl}
                  alt="Uploaded preview"
                  className="w-full max-h-40 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            {/* PDF preview */}
            {isPdf && (
              <div className="flex items-center gap-3 p-3 bg-neutral-900/50">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {uploadedResult?.originalName || "PDF Document"}
                  </p>
                  {uploadedResult?.bytes && (
                    <p className="text-xs text-neutral-500">{formatFileSize(uploadedResult.bytes)}</p>
                  )}
                </div>
              </div>
            )}

            {/* File info bar + actions */}
            <div className="flex items-center gap-2 p-2 bg-black/30 border-b border-white/5">
              <div className="flex-1 min-w-0 flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-neutral-300 font-medium truncate">
                  {uploadedResult?.originalName || "File attached"}
                </p>
              </div>

              {/* Copy URL */}
              <button
                onClick={handleCopyUrl}
                title="Copy Link"
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-teal-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z"/><path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z"/></svg>
                )}
              </button>

              {/* Open in new tab */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open file"
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd"/><path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd"/></svg>
              </a>

              {/* Remove */}
              {!disabled && (
                <button
                  onClick={handleRemove}
                  title="Remove file"
                  className="flex-shrink-0 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd"/></svg>
                </button>
              )}
            </div>

            {/* Upload info */}
            {uploadedResult && (
              <div className="flex items-center gap-3 px-3 py-1.5 bg-black/10 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/></svg>
                  Uploaded
                </span>
                {uploadedResult.bytes > 0 && <span>{formatFileSize(uploadedResult.bytes)}</span>}
                {uploadedResult.width && <span>{uploadedResult.width}×{uploadedResult.height}px</span>}
                {uploadedResult.format && <span className="uppercase font-mono">{uploadedResult.format}</span>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-upload button if file exists */}
      {currentUrl && !disabled && (
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
        >
          <input ref={inputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd"/></svg>
          Replace file
        </button>
      )}
    </div>
  );
}
