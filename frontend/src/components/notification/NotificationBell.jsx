import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationBell({ mobile = false }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Fermer le menu lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cliquer sur une notification
  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);

    if (notification.data?.url) {
      navigate(notification.data.url);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bouton cloche */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition ${
          mobile
            ? "text-white/90 hover:bg-white/10"
            : "text-slate-500 hover:bg-slate-100"
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={20} />

        {/* Compteur */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          className={`absolute top-full mt-3 w-[min(340px,calc(100vw-24px))] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden ${
            mobile ? "right-[-12px]" : "right-0"
          }`}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Notifications
              </h3>
              <p className="text-xs text-slate-400">
                {unreadCount} non lue(s)
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs text-[#0065CD] hover:underline"
              >
                <CheckCheck size={14} />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell
                  size={28}
                  className="mx-auto text-slate-300 mb-2"
                />
                <p className="text-sm text-slate-400">
                  Aucune notification
                </p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition ${
                    !notification.read_at ? "bg-blue-50/70" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Indicateur non lu */}
                    <div className="pt-1.5">
                      <span
                        className={`block w-2 h-2 rounded-full ${
                          !notification.read_at
                            ? "bg-[#0065CD]"
                            : "bg-transparent"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.data?.titre || "Notification"}
                      </p>

                      <p className="text-xs text-slate-600 mt-1 break-words">
                        {notification.data?.message}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-2">
                        {new Date(
                          notification.created_at
                        ).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}