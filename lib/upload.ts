/**
 * Cloudinary Upload Utility
 * Sends files to /api/upload (backend) which uploads to Cloudinary.
 * Files NEVER go to MongoDB — only the returned URL is stored.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type UploadFolder =
  | "team"
  | "blog"
  | "portfolio"
  | "payment"
  | "attachment"
  | "avatar"
  | "general";

export interface UploadResult {
  success: boolean;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number | null;
  height: number | null;
  resourceType: string;
  folder: UploadFolder;
  originalName: string;
}

export interface MultipleUploadResult {
  success: boolean;
  count: number;
  results: (UploadResult | { success: false; error: string; originalName: string })[];
}

// ─── Upload a single file ─────────────────────────────────────────────────────
export async function uploadFile(
  file: File,
  folder: UploadFolder = "general",
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  // Use XMLHttpRequest for progress tracking
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/api/upload?folder=${folder}`);
      xhr.withCredentials = true;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.success) {
            resolve(data as UploadResult);
          } else {
            reject(new Error(data.message || "Upload failed"));
          }
        } catch {
          reject(new Error("Failed to parse upload response"));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

      xhr.send(formData);
    });
  }

  // Simple fetch without progress
  const res = await fetch(`${API_URL}/api/upload?folder=${folder}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data as UploadResult;
}

// ─── Upload multiple files ────────────────────────────────────────────────────
export async function uploadFiles(
  files: File[],
  folder: UploadFolder = "general"
): Promise<MultipleUploadResult> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_URL}/api/upload/multiple?folder=${folder}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  return data as MultipleUploadResult;
}

// ─── Delete a file from Cloudinary (admin) ───────────────────────────────────
export async function deleteUploadedFile(
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<{ success: boolean; message: string }> {
  const encodedId = encodeURIComponent(publicId);
  const res = await fetch(`${API_URL}/api/upload/${encodedId}?type=${resourceType}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

// ─── Check if Cloudinary is configured ───────────────────────────────────────
export async function checkCloudinaryStatus(): Promise<{
  configured: boolean;
  cloudName: string | null;
  message: string;
}> {
  try {
    const res = await fetch(`${API_URL}/api/upload/status`);
    const data = await res.json();
    return data;
  } catch {
    return { configured: false, cloudName: null, message: "Could not reach upload service" };
  }
}

// ─── Validate file before upload ─────────────────────────────────────────────
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowPdf?: boolean;
    allowImages?: boolean;
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowPdf = true, allowImages = true } = options;

  const imageMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const pdfMimes = ["application/pdf"];
  const allowed = [
    ...(allowImages ? imageMimes : []),
    ...(allowPdf ? pdfMimes : []),
  ];

  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed: ${file.type}. Allowed: ${allowed.join(", ")}`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// ─── Format file size ─────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
