"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNowStrict } from "date-fns";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/customer/dal";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  priority: string;
}

export const NotificationsModal = ({
  open,
  onOpenChange,
  onUnreadCountChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange: (count: number) => void;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchNotifications();
  }, [open]);

  const handleMarkOne = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    const newCount = await getUnreadNotificationCount();
    onUnreadCountChange(newCount);
  };

  const handleMarkAll = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    onUnreadCountChange(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl py-12">
        <DialogHeader>
          <DialogTitle className="text-danger-600 flex justify-between items-center">
            Last {notifications.length >= 10 ? "10" : notifications.length}{" "}
            Notifications
            {notifications.some((n) => !n.read) && (
              <Button variant={`ghost`}
                onClick={handleMarkAll}
                className="text-sm text-primary-600 ml-4"
              >
                Mark all as read
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-4 mt-4">
          {isLoading ? (
            <p className="text-gray-500 text-sm text-center">
              Loading notifications…
            </p>
          ) : notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg p-3 border ${
                  n.read ? "bg-muted text-gray-400" : "bg-white"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{n.type}</p>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNowStrict(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <Button
                      variant={`ghost`}
                      onClick={() => handleMarkOne(n.id)}
                      className="text-xs text-primary-600"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No notifications yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
