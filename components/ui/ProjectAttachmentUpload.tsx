"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  uploadFile,
  validateFile,
  formatFileSize,
  type UploadResult,
} from "@/lib/upload";

export interface ProjectAttachment {
  url: string;
  name: string;
  size?: number;
  format?: string;
  publicId?: string;
}

interface ProjectAttachmentUploadProps {
  attachments: ProjectAttachment[];
  onChange: (attachments: ProjectAttachment[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
}

interface UploadingState {
  id: string;
  fileName: string;
  progress: number;
}

export function ProjectAttachmentUpload({
  attachments = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 20,
  disabled = false,
}: ProjectAttachmentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingQueue, setUploadingQueue] = useState<UploadingState[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = attachments.length < maxFiles && !disabled;

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setErrorMsg(null);
      const fileList = Array.from(files);

      if (attachments.length + fileList.length > maxFiles) {
        setErrorMsg(`You can attach up to ${maxFiles} files in total (${maxFiles - attachments.length} remaining).`);
        return;
      }

      for (const file of fileList) {
        const validation = validateFile(file, { maxSizeMB, allowPdf: true, allowImages: true, allowDocs: true });
        if (!validation.valid) {
          setErrorMsg(validation.error || "Unsupported file format.");
          return;
        }
      }

      // Process uploads sequentially or in parallel
      for (const file of fileList) {
        const uploadId = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        setUploadingQueue((prev) => [
          ...prev,
          { id: uploadId, fileName: file.name, progress: 5 },
        ]);

        try {
          const res: UploadResult = await uploadFile(file, "attachment", (percent) => {
            setUploadingQueue((prev) =>
              prev.map((item) => (item.id === uploadId ? { ...item, progress: percent } : item))
            );
          });

          const newAttachment: ProjectAttachment = {
            url: res.url,
            name: file.name || res.originalName || "Attachment",
            size: res.bytes || file.size,
            format: res.format || file.name.split(".").pop()?.toLowerCase(),
            publicId: res.publicId,
          };

          onChange([...attachments, newAttachment]);
        } catch (err: any) {
          console.error("Upload error:", err);
          setErrorMsg(err.message || `Failed to upload "${file.name}". Please try again.`);
        } finally {
          setUploadingQueue((prev) => prev.filter((item) => item.id !== uploadId));
        }
      }
    },
    [attachments, maxFiles, maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (!canAddMore) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [canAddMore, handleFiles]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = attachments.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const getFileBadge = (item: ProjectAttachment) => {
    const nameOrFormat = (item.format || item.name.split(".").pop() || "").toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(nameOrFormat) ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
    const isPdf = nameOrFormat === "pdf" || /\.pdf$/i.test(item.url);
    const isDoc = ["doc", "docx", "txt", "rtf"].includes(nameOrFormat);

    if (isImage) {
      return {
        type: "image",
        label: "IMAGE",
        badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        icon: (
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        ),
      };
    }
    if (isPdf) {
      return {
        type: "pdf",
        label: "PDF",
        badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        icon: (
          <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M9 15h6"/>
            <path d="M9 12h6"/>
            <path d="M9 18h3"/>
          </svg>
        ),
      };
    }
    if (isDoc) {
      return {
        type: "doc",
        label: "DOC",
        badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        icon: (
          <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
            <path d="M6 14h6"/>
          </svg>
        ),
      };
    }
    return {
      type: "generic",
      label: "FILE",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      icon: (
        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    };
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
          <span className="text-base">📎</span>
          <span>Direct Brief Attachments</span>
          <span className="text-xs font-normal text-neutral-500">(PDF, Word Doc, Screenshots)</span>
        </label>
        <span className="text-xs font-mono text-neutral-500">
          {attachments.length}/{maxFiles} Attached
        </span>
      </div>

      {/* Dropzone */}
      {canAddMore && (
        <motion.div
          whileHover={{ borderColor: "rgba(20,184,160,0.55)", backgroundColor: "rgba(20,184,160,0.03)" }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center group
            ${
              isDragging
                ? "border-primary-400 bg-primary-500/10 shadow-[0_0_24px_rgba(20,184,160,0.25)]"
                : "border-neutral-700/60 bg-neutral-900/30 hover:border-primary-500/50"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,image/png,image/jpeg,image/webp,image/jpg"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-teal-500/5 border border-primary-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(20,184,160,0.15)] group-hover:scale-105 transition-transform duration-200">
            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <p className="text-sm font-medium text-white mb-1">
            <span className="text-primary-400 underline underline-offset-4 decoration-primary-500/50 group-hover:text-primary-300">
              Click to browse
            </span>{" "}
            or drag & drop files here
          </p>
          <p className="text-xs text-neutral-500">
            Upload requirements doc (PDF, DOCX), Figma exports, or design screenshots · Up to {maxSizeMB}MB
          </p>
        </motion.div>
      )}

      {/* Error alert */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-between text-xs text-red-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active uploading progress list */}
      <AnimatePresence>
        {uploadingQueue.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3.5 rounded-xl bg-primary-500/5 border border-primary-500/20 space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-200">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin inline-block" />
                <span className="font-medium truncate max-w-[240px] sm:max-w-xs">{item.fileName}</span>
              </div>
              <span className="font-mono text-primary-400 font-bold">{item.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-teal-400 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Uploaded attachments cards */}
      {attachments.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <AnimatePresence initial={false}>
            {attachments.map((file, idx) => {
              const badge = getFileBadge(file);
              return (
                <motion.div
                  key={file.url + idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge / thumbnail */}
                    {badge.type === "image" ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${badge.badgeColor}`}
                      >
                        {badge.icon}
                      </div>
                    )}

                    {/* File title & details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                          {file.name}
                        </p>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold shrink-0 ${badge.badgeColor}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5 font-mono">
                        {file.size ? <span>{formatFileSize(file.size)}</span> : null}
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Ready for review
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open attachment"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="hidden sm:inline">View</span>
                    </a>

                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        title="Remove attachment"
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
