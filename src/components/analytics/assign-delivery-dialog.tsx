"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { useAssignOrder } from "@/hooks/use-order";
import { UserRole } from "@/lib/rbac/types";
import { ApiError } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Truck } from "@/lib/icons";

interface AssignDeliveryDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignDeliveryDialog({
  orderId,
  open,
  onOpenChange,
}: AssignDeliveryDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers({ role: UserRole.DELIVERY });
  const { mutate: assignOrder, isPending: isAssigning } = useAssignOrder();

  const deliveryUsers = usersResponse?.data || [];

  const handleAssign = () => {
    if (!selectedUserId) {
      toast.error("Please select a delivery person");
      return;
    }

    assignOrder(
      { id: orderId, data: { assigneeUserId: selectedUserId } },
      {
        onSuccess: () => {
          toast.success("Order assigned successfully");
          onOpenChange(false);
          setSelectedUserId("");
        },
        onError: (err: ApiError) => {
          toast.error(err.response?.data?.message || "Failed to assign order");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-medium">
            <Truck className="h-5 w-5 text-primary" />
            Assign Delivery
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-gray-400">
            Select a delivery professional to handle this order.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            disabled={isLoadingUsers}
          >
            <SelectTrigger className="w-full rounded-xl border-gray-100 font-medium">
              <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select assignee"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100">
              {deliveryUsers.map((user) => (
                <SelectItem key={user.id} value={user.id} className="font-medium">
                  {user.name} ({user.email})
                </SelectItem>
              ))}
              {deliveryUsers.length === 0 && !isLoadingUsers && (
                <p className="p-2 text-xs text-center text-gray-500 font-medium">No delivery users found</p>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-medium"
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="rounded-xl font-medium px-8"
            disabled={isAssigning || !selectedUserId}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
