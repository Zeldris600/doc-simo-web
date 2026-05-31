"use client";

import { useState } from "react";
import { useAssignOrder } from "@/hooks/use-order";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [driverName, setDriverName] = useState("");
  const { mutate: assignOrder, isPending: isAssigning } = useAssignOrder();

  const handleAssign = () => {
    const name = driverName.trim();
    if (!name) {
      toast.error("Enter the delivery person's name");
      return;
    }

    assignOrder(
      { id: orderId, data: { assigneeName: name } },
      {
        onSuccess: () => {
          toast.success(`Assigned to ${name}`);
          onOpenChange(false);
          setDriverName("");
        },
        onError: (err: ApiError) => {
          toast.error(err.response?.data?.message || "Failed to assign order");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border border-black/8 shadow-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-medium">
            <Truck className="h-5 w-5 text-primary" />
            Assign delivery
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the name of the driver handling this order.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-2">
          <Label htmlFor="driver-name" className="text-sm font-medium">
            Driver name
          </Label>
          <Input
            id="driver-name"
            placeholder="e.g. Jean Mbarga"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="h-10 rounded-lg"
            onKeyDown={(e) => e.key === "Enter" && handleAssign()}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg font-medium"
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="rounded-lg font-medium px-8"
            disabled={isAssigning || !driverName.trim()}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning…
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
