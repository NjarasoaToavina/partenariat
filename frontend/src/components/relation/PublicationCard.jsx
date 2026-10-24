import { useState } from "react";
import { MessageCircle, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import UserAvatar from "./UserAvatar.jsx";
import CommentSection from "./CommentSection.jsx";
import {
  fmtFullDate,
  plural,
  storageUrl,
  timeAgo,
} from "./relationUtils";

export default function PublicationCard({
  publication,
  currentUser,
  onEdit,
  onDelete,
  onReact,
  onAddComment, // (publication, contenu) => Promise
  onDeleteComment, // (publication, commentaire) => void
}) {
  const [showComments, setShowComments] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  const commentaires = publication.commentaires ?? [];
  const isOwner = currentUser?.id === publication.user_id;
  const photo = storageUrl(publication.photo_pub);
  console.log("Photo depuis Laravel :", publication.photo_pub);
    console.log("URL générée :", photo);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* En-tête : auteur + actions */}
      <header className="flex items-start gap-3 px-4 pt-4">
        <UserAvatar user={publication.user} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {publication.user?.name ?? "Partenaire"}
          </p>
          <p
            className="text-xs text-slate-500"
            title={fmtFullDate(publication.date_pub)}
          >
            {timeAgo(publication.date_pub)}
          </p>
        </div>
        {isOwner && (
          <div className="flex shrink-0 items-center">
            <button
              onClick={() => onEdit(publication)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0065CD]"
              aria-label="Modifier la publication"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(publication)}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Supprimer la publication"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </header>

      {/* Contenu */}
      <div className="space-y-2 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">
          {publication.titre_pub}
        </h2>
        <p className="whitespace-pre-line break-words text-sm text-slate-700">
          {publication.contenu_pub}
        </p>
      </div>

      {photo && !photoFailed && (
        <img
          src={photo}
          alt={publication.titre_pub}
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          className="max-h-96 w-full bg-slate-100 object-cover"
        />
      )}

      {/* Compteurs */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <ThumbsUp size={12} className="text-[#0065CD]" />
          {plural(publication.reaction ?? 0, "réaction")}
        </span>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="hover:underline"
        >
          {plural(commentaires.length, "commentaire")}
        </button>
      </div>

      {/* Boutons d'interaction */}
      <div className="grid grid-cols-2 border-t border-slate-100 text-sm font-medium text-slate-600">
        <button
          onClick={() => onReact(publication)}
          className="inline-flex items-center justify-center gap-2 py-2.5 hover:bg-slate-50 hover:text-[#0065CD]"
        >
          <ThumbsUp size={16} />
          J'aime
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
          className={`inline-flex items-center justify-center gap-2 py-2.5 hover:bg-slate-50 hover:text-[#0065CD] ${
            showComments ? "text-[#0065CD]" : ""
          }`}
        >
          <MessageCircle size={16} />
          Commenter
        </button>
      </div>

      {showComments && (
        <CommentSection
          commentaires={commentaires}
          currentUser={currentUser}
          onAdd={(contenu) => onAddComment(publication, contenu)}
          onDelete={(c) => onDeleteComment(publication, c)}
        />
      )}
    </article>
  );
}