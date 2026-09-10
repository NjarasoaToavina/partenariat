import { useRef, useState } from "react";
import { UserCircle2 } from "lucide-react";

export default function PhotoUpload({ photo, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        Photo de profil
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-4 border-2 border-dashed rounded-xl px-5 py-5 cursor-pointer transition-colors ${
          isDragging
            ? "border-sky-500 bg-sky-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {photo ? (
          <img
            src={URL.createObjectURL(photo)}
            alt="Aperçu du profil"
            className="w-14 h-14 rounded-full object-cover shrink-0"
          />
        ) : (
          <UserCircle2 size={44} className="text-slate-300 shrink-0" strokeWidth={1.2} />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {photo ? photo.name : "Cliquez pour ajouter une photo"}
          </p>
          <p className="text-sm text-slate-400">ou glissez-déposez votre image ici</p>
          <p className="text-xs text-slate-400 mt-1">
            Formats acceptés : JPG, PNG (max 2 Mo)
          </p>
        </div>
      </div>
    </div>
  );
}