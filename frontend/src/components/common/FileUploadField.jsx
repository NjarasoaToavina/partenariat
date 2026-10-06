import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

export default function FileUploadField({
  label,
  hint,
  accept = "image/jpeg,image/png,application/pdf",
  file,
  existingUrl,
  onChange,
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f) onChange(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;
  const isImage = file ? file.type.startsWith("image/") : true;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-4 border-2 border-dashed rounded-xl px-5 py-4 cursor-pointer transition-colors ${
          isDragging
            ? "border-sky-500 bg-sky-50"
            : "border-slate-300 hover:border-slate-400"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {previewUrl && isImage ? (
          <img
            src={previewUrl}
            alt={label}
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            {previewUrl ? (
              <FileText size={22} className="text-slate-400" />
            ) : (
              <UploadCloud size={22} className="text-slate-400" />
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {file ? file.name : previewUrl ? "Fichier déjà enregistré" : "Cliquez pour ajouter un fichier"}
          </p>
          <p className="text-sm text-slate-400">ou glissez-déposez ici</p>
          {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>

        {file && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="text-slate-400 hover:text-rose-600 shrink-0"
            aria-label="Retirer le fichier"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}