# Admin broadcast & general admin notifications (FE)

**This file is the canonical reference** for staff-driven “notify users” flows: who can call what, payloads, HTTP codes, polling, FCM topic behavior, and **delivery policy**. Other docs may link here; **channel and email rules are defined only here.**

---

## Product policy (channels)

**Ads and general admin notifications are never sent by email.** They use:

- **In-app** notification row + realtime to the user (web: Pusher `notification.new` on `private-user-{userId}` after the row is created).
- **Push** (FCM) where the user has registered tokens.

REST **audience broadcast**, Socket.IO **targeted send**, and **FCM topic** blasts follow this policy (topic = push only, no in-app row unless you use the batched REST path).

Staff need **`notifications:write`** (same permission name as in code: `NOTIFICATIONS_WRITE`).

---

## 1. Socket.IO: targeted send (small explicit `userIds`)

For **small lists** of user IDs, staff tools emit on the central realtime gateway (not the HTTP `/api` prefix).

| Item | Value |
|------|--------|
| **Namespace** | `/realtime` |
| **URL** | `{apiOrigin}/realtime` (e.g. `io('https://api.example.com/realtime', { … })`) |
| **Engine path** | `/socket.io` (Socket.IO default) |
| **Auth** | Better Auth **session cookies** on the handshake (`withCredentials: true` in browsers). |

**Event:** `notifications.admin.send`  
**Permission:** `NOTIFICATIONS_WRITE`  
**Payload** (same idea as the old `SendNotificationDto`):

```json
{
  "userIds": ["user_cuid_1", "user_cuid_2"],
  "title": "Short title",
  "body": "Message body",
  "data": {}
}
```

`data` is optional (object for deep links / metadata stored on the notification).

**Ack (success):** wrapped shape your app uses for Socket.IO acks, including `{ data: { sent: number } }` (count of users processed).

**Server behavior:** For each user: creates **in-app** notification (`kind: "admin"`), emits realtime to that user, queues **FCM push** — **does not send email.**

**Connection examples and the full Socket.IO event catalogue** (support, etc.): [FE_REALTIME_GATEWAY.md](./FE_REALTIME_GATEWAY.md).

**Web: `notification.new` payload shape** (Pusher): [FE_NOTIFICATIONS_REALTIME_PUSHER.md](./FE_NOTIFICATIONS_REALTIME_PUSHER.md).

---

## 2. REST: start batched audience broadcast

**`POST /api/notifications/admin/broadcast`**

- **Auth:** session required.
- **Permission:** `NOTIFICATIONS_WRITE`.
- **Response:** **`202 Accepted`**. Usual wrapped body, e.g. `{ data: { broadcastId, bullJobId }, message: "…" }`.
  - **`broadcastId`:** use for polling (below).
  - **`bullJobId`:** Bull job id for the orchestrator job `admin_broadcast_start` (optional in UI).

### Request body (`AdminBroadcastDto`)

| Field | Type | Notes |
|--------|------|--------|
| `audience` | `"CUSTOMERS"` \| `"ALL_USERS"` | `CUSTOMERS` = users with `role === CUSTOMER`. `ALL_USERS` = every user row (no soft-delete field on `User` today). |
| `title` | string | Short title. |
| `body` | string | Body text. |
| `channels` | optional `("in_app" \| "push")[]` | **Default:** `["in_app", "push"]`. **`email` is not allowed** — API rejects it; server never sends email for this flow. |
| `data` | optional object | Stored on the broadcast and merged into each notification’s `data`. Server always adds **`broadcastId`** on the per-user send path. |

### Processing model

1. Creates **`AdminBroadcast`** row (`PENDING`) and enqueues **`admin_broadcast_start`**.
2. Worker sets **`RUNNING`**, **`targetCount`**, enqueues **`admin_broadcast_chunk`** jobs (cursor on `user.id`, chunked).
3. Each chunk: for each user, **in-app** and/or **push** per `channels` — **never email**. In-app rows use **`kind: "admin_broadcast"`** (distinct from Socket.IO targeted `kind: "admin"`).
4. **`processedCount`** increments per user. Final **`COMPLETED`** or **`FAILED`** (see **`lastError`**).

**Poll:** **`GET /api/notifications/admin/broadcast/:id`** (same permission) for `status`, `processedCount`, `targetCount`, `lastError`, timestamps.

### Client handling of `data`

Use a **string-keyed JSON object** for deep links (e.g. `screen`, `orderId`). On mobile, FCM **`data`** values are strings; nested objects may be stringified depending on pipeline.

---

## 3. REST: customers FCM topic (one push, many devices)

**`POST /api/notifications/admin/broadcast/topic`**

- **Permission:** `NOTIFICATIONS_WRITE`.
- **Response:** `200`, wrapped `{ success, messageId? }`.

### Body (`AdminBroadcastTopicDto`)

- **`title`**, **`body`** (required).
- **`data`** (optional): FCM data map — **string values only**. Server sets **`type: "admin_topic_broadcast"`** and prefixes the visible title with the app name for this send path.

### Subscription

On **`POST /api/notifications/fcm/register`**, **`CUSTOMER`** users have that device token **subscribed** to topic **`doctasimo_customers`**. Unregister **unsubscribes** that token.

**FE implication:** No per-user in-app row for topic sends. For inbox history, use the batched REST audience broadcast in **section 2** (or a product-specific hybrid).

---

## 4. Staff UI suggestions

- After **`202`** on batched broadcast, show progress and poll **`GET /api/notifications/admin/broadcast/:id`** until `COMPLETED` or `FAILED`.
- Show **`processedCount` / `targetCount`** when `targetCount` is set.
- Do not offer **email** for these flows — it is not supported.

---

## 5. Mechanism comparison

| Mechanism | In-app row | Push | Email | Scale / use |
|-----------|------------|------|-------|-------------|
| **`notifications.admin.send`** (Socket.IO, `userIds[]`) | Yes | Yes | **No** | Small explicit lists |
| **`POST /api/notifications/admin/broadcast`** | Optional (`in_app`) | Optional | **No** | Large audiences, async + audit row |
| **`POST /api/notifications/admin/broadcast/topic`** | No | Yes | No | One FCM message to subscribed customer devices |

---

## 6. Related docs (wiring only)

| Doc | Use for |
|-----|--------|
| [FE_REALTIME_GATEWAY.md](./FE_REALTIME_GATEWAY.md) | Socket.IO URL, auth, all `/realtime` events |
| [FE_NOTIFICATIONS_REALTIME_PUSHER.md](./FE_NOTIFICATIONS_REALTIME_PUSHER.md) | Pusher channels, `notification.new` payload for web |

**Admin/general channel policy** lives **only in this file** (above).
