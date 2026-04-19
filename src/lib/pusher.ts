import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const pusherHost = process.env.NEXT_PUBLIC_PUSHER_HOST;
const pusherPort = process.env.NEXT_PUBLIC_PUSHER_PORT;
const pusherUseTls = process.env.NEXT_PUBLIC_PUSHER_USE_TLS !== "false";

let pusherInstance: Pusher | null = null;
let currentToken: string | null = null;

export function isPusherConfigured(): boolean {
  return Boolean(pusherKey && apiUrl && (pusherCluster || pusherHost));
}

/**
 * Private-channel Pusher client. Auth: `POST {apiUrl}/pusher/auth` with Bearer and/or cookies.
 * Returns null if realtime is not configured (server triggers are no-ops).
 */
export function getPusherClient(token: string | undefined | null): Pusher | null {
  if (!isPusherConfigured() || !token) {
    return null;
  }

  if (pusherInstance && currentToken === token) {
    return pusherInstance;
  }

  if (pusherInstance) {
    pusherInstance.disconnect();
  }

  currentToken = token;

  const options: ConstructorParameters<typeof Pusher>[1] = {
    ...(pusherHost
      ? {
          wsHost: pusherHost,
          wsPort: pusherPort ? Number(pusherPort) : pusherUseTls ? 443 : 80,
          wssPort: pusherPort ? Number(pusherPort) : 443,
          forceTLS: pusherUseTls,
          enabledTransports: ["ws", "wss"] as ("ws" | "wss")[],
          cluster: pusherCluster || "mt1",
        }
      : {
          cluster: pusherCluster!,
        }),
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          fetch(`${apiUrl}/pusher/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
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
            .then((data: { data?: unknown } | unknown) => {
              const body =
                data && typeof data === "object" && "data" in data && data.data !== undefined
                  ? (data as { data: unknown }).data
                  : data;
              callback(null, body as Parameters<typeof callback>[1]);
            })
            .catch((err: Error) => {
              callback(err, null);
            });
        },
      };
    },
    // @ts-expect-error withCredentials is valid in pusher-js but types may omit it
    withCredentials: true,
  };

  pusherInstance = new Pusher(pusherKey!, options);

  return pusherInstance;
}
