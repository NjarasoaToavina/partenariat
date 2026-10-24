import { useState } from "react";
import { getInitials, storageUrl } from "./relationUtils";

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm" };

// Photo de profil, avec les initiales si l'image est absente ou introuvable
export default function UserAvatar({ user, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const src = storageUrl(user?.image);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0065CD]/10 font-semibold text-[#0065CD] ${SIZES[size]}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={user?.name ?? "Utilisateur"}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        getInitials(user?.name)
      )}
    </div>
  );
}