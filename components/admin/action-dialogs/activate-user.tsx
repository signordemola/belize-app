import { runUserScript } from "@/actions/users-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { toast } from "sonner";

const ActivateUserDialog = ({
  userId,
  isActive,
  open,
  onOpenChange,
}: {
  userId: string;
  isActive: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(() => {
      runUserScript(userId, "activateUser").then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success(
            `User ${isActive ? "deactivated" : "activated"} successfully`
          );
          onOpenChange(false);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-primary-600">
            {isActive ? "Deactivate" : "Activate"} User Account
          </DialogTitle>
          <DialogDescription>
            This will {isActive ? "deactivate" : "activate"} the user. Are you
            sure you want to continue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivateUserDialog;
