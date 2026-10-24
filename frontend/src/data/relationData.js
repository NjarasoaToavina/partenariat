// URL publique des fichiers stockés par Laravel (php artisan storage:link).
// Définis VITE_STORAGE_URL dans ton .env, ex. VITE_STORAGE_URL=http://localhost:8000/storage
import { URL } from "../services/api";

export const STORAGE_URL = `${URL.replace(/\/api\/?$/, "")}/storage`;

export const MAX_PHOTO_SIZE_MB = 2;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_TITRE = 150;
export const MAX_COMMENT = 500;