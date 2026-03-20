import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let pusherInstance: Pusher | null = null;
let currentToken: string | null = null;

export const getPusherClient = (token: string) => {
  if (pusherInstance && currentToken === token) return pusherInstance;

  if (pusherInstance) {
    pusherInstance.disconnect();
  }
  
  currentToken = token;

  if (!pusherKey || !pusherCluster || !apiUrl) {
    throw new Error("Missing Pusher configuration");
  }

  pusherInstance = new Pusher(pusherKey, {
    cluster: pusherCluster,
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          fetch(`${apiUrl}/pusher/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((res) => {
              if (!res.ok) {
                return res.json().then((err) => {
                  throw new Error(err.message || "Pusher Auth failed");
                });
              }
              return res.json();
            })
            .then((data) => {
              // Pusher expects the response body directly, usually { auth: "...", channel_data: "..." }
              // If the backend wraps it in 'data', use data.data
              callback(null, data.data || data);
            })
            .catch((err) => {
              callback(err, null);
            });
        },
      };
    },
    // For cross-origin cookie support
    // @ts-expect-error withCredentials is valid in pusher-js but types might be missing
    withCredentials: true,
  });

  return pusherInstance;
};
