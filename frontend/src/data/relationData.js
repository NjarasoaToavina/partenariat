// URL publique des fichiers stockés par Laravel (php artisan storage:link).
// Définis VITE_STORAGE_URL dans ton .env, ex. VITE_STORAGE_URL=http://localhost:8000/storage
export const STORAGE_URL = (
  import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage"
).replace(/\/$/, "");

export const MAX_PHOTO_SIZE_MB = 2;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_TITRE = 150;
export const MAX_COMMENT = 500;