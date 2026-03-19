import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let pusherInstance: Pusher | null = null;

export const getPusherClient = () => {
  if (pusherInstance) return pusherInstance;

  if (!pusherKey || !pusherCluster || !apiUrl) {
    throw new Error("Missing Pusher configuration");
  }

  pusherInstance = new Pusher(pusherKey, {
    cluster: pusherCluster,
    authEndpoint: `${apiUrl}/pusher/auth`,
    auth: {
      params: {},
      headers: {},
    },
    // For cross-origin cookie support
    // @ts-expect-error withCredentials is valid in pusher-js but types might be missing
    withCredentials: true,
  });

  return pusherInstance;
};
