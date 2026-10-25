import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

console.log(
    "Clé Reverb :",
    import.meta.env.VITE_REVERB_APP_KEY
);

export const createEcho = () => {
    return new Echo({
        broadcaster: "reverb",

        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT),

        forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
        enabledTransports: ["ws", "wss"],

        channelAuthorization: {
            endpoint: "http://localhost:8006/api/broadcasting/auth",
            transport: "ajax",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
                Accept: "application/json",
            },
        },
    });
};