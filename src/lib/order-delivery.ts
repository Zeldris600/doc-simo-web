import type { Order } from "@/types/api";

/** Driver display name from order metadata or assigned user relation. */
export function getOrderDriverDisplayName(order: Order): string {
  const meta = order.metadata;
  if (meta && typeof meta === "object") {
    for (const key of ["assigneeName", "deliveryDriverName", "driverName"] as const) {
      const value = meta[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }
  const assignedUser = order.assignedTo;
  if (assignedUser?.name?.trim()) {
    return assignedUser.name.trim();
  }
  if (order.assignedToUserId) {
    return "Assigned";
  }
  return "Unassigned";
}
