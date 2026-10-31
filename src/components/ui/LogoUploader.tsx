"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface LogoUploaderProps {
  currentLogo: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function LogoUploader({
  currentLogo,
  onUploadSuccess,
  label = "لوگوی فروشگاه",
}: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطایی در آپلود رخ داد");
      }

      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || "آپلود ناموفق بود");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUploadSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">{label}</label>

      {error && (
        <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
        {/* Preview box */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
          {preview ? (
            <>
              <img src={preview} alt="Logo preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                title="حذف لوگو"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-7 h-7 text-slate-600" />
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            id="logo-file-input"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>در حال آپلود لوگو...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span>{preview ? "تغییر تصویر لوگو" : "انتخاب و آپلود لوگو"}</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 mt-1">
            فرمت‌های مجاز: PNG, JPG, WebP, SVG (حداکثر ۵ مگابایت)
          </p>
        </div>
      </div>
    </div>
  );
}
