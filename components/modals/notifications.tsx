"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNowStrict } from "date-fns";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  priority: string;
}

export const NotificationsModal = ({
  notifications,
  open,
  onOpenChange,
}: {
  notifications: Notification[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl py-12">
        <DialogHeader>
          <DialogTitle className="text-danger-600">
            Last {notifications.length >= 10 ? "10" : notifications.length}{" "}
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-4 mt-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg p-3 border ${
                  n.read ? "bg-gray-50 text-gray-500" : "bg-white"
                }`}
              >
                <p className="font-medium text-gray-900">{n.type}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNowStrict(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No notifications yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
