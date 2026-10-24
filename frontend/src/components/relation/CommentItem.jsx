import { Trash2 } from "lucide-react";
import UserAvatar from "./UserAvatar.jsx";
import { fmtFullDate, timeAgo } from "./relationUtils";

export default function CommentItem({ commentaire, canDelete, onDelete }) {
  return (
    <li className="flex items-start gap-2.5">
      <UserAvatar user={commentaire.user} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-slate-100 px-3 py-2">
          <p className="text-sm font-semibold text-slate-800">
            {commentaire.user?.name ?? "Utilisateur"}
          </p>
          <p className="whitespace-pre-line break-words text-sm text-slate-700">
            {commentaire.contenu_com}
          </p>
        </div>
        <div className="mt-0.5 flex items-center gap-3 px-2 text-xs text-slate-500">
          <span title={fmtFullDate(commentaire.date_com)}>
            {timeAgo(commentaire.date_com)}
          </span>
          {canDelete && (
            <button
              onClick={() => onDelete(commentaire)}
              className="inline-flex items-center gap-1 hover:text-red-600"
              aria-label="Supprimer le commentaire"
            >
              <Trash2 size={12} />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </li>
  );
}