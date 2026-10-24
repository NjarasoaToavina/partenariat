import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import CommentItem from "./CommentItem.jsx";
import UserAvatar from "./UserAvatar.jsx";
import { MAX_COMMENT } from "../../data/relationData";

export default function CommentSection({
  commentaires,
  currentUser,
  onAdd, // (contenu) => Promise
  onDelete, // (commentaire) => void
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const contenu = text.trim();
    if (!contenu || sending) return;
    setSending(true);
    try {
      await onAdd(contenu);
      setText(""); // on ne vide le champ que si l'envoi a réussi
    } catch {
      /* l'erreur est déjà signalée par la page (toast) */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-slate-100 px-4 py-3">
      {commentaires.length === 0 ? (
        <p className="py-2 text-center text-sm text-slate-500">
          Aucun commentaire pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {commentaires.map((c) => (
            <CommentItem
              key={c.id_com}
              commentaire={c}
              canDelete={currentUser?.id === c.user_id}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="flex items-center gap-2.5">
        <UserAvatar user={currentUser} size="sm" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_COMMENT}
          placeholder="Écrire un commentaire…"
          className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 focus:border-[#0065CD] focus:outline-none focus:ring-2 focus:ring-[#0065CD]/20"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="rounded-full p-2 text-[#0065CD] hover:bg-[#0065CD]/10 disabled:opacity-40"
          aria-label="Envoyer le commentaire"
        >
          {sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
}