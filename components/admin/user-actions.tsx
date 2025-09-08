"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { BasicUserData } from "@/types/users";
import { UserDetailDialog } from "./action-dialogs/user-details";
import { EditUserDialog } from "./action-dialogs/edit-user";
import ActivateUserDialog from "./action-dialogs/activate-user";
import { BlockTransferDialog } from "./action-dialogs/block-transfer";
import { PopulateDataDialog } from "./action-dialogs/populate-data";
import { ResetDataDialog } from "./action-dialogs/reset-data";

const UserActions = ({ user }: { user: BasicUserData }) => {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [activeDialogOpen, setActiveDialogOpen] = useState(false);
  const [blockDialogOpen, setBLockDialogOpen] = useState(false);
  const [populateDialogOpen, setPopulateDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailDialogOpen(true)}>
            View User Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditUserDialog(true)}>
            Edit User Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialogOpen(true)}>
            {user.isActive ? "Deactivate" : "Activate"} User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBLockDialogOpen(true)}>
            {user.isTransferBlocked ? "Unblock" : "Block"} Transfer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPopulateDialogOpen(true)}>
            Populate Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResetDialogOpen(true)}>
            Reset Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailDialog
        user={user}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <EditUserDialog
        user={user}
        open={editUserDialog}
        onOpenChange={setEditUserDialog}
      />

      <ActivateUserDialog
        userId={user.id}
        isActive={user.isActive}
        open={activeDialogOpen}
        onOpenChange={setActiveDialogOpen}
      />

      <BlockTransferDialog
        userId={user.id}
        isBlocked={user.isTransferBlocked}
        open={blockDialogOpen}
        onOpenChange={setBLockDialogOpen}
      />

      <PopulateDataDialog
        userId={user.id}
        open={populateDialogOpen}
        onOpenChange={setPopulateDialogOpen}
      />

      <ResetDataDialog
        userId={user.id}
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
      />
    </div>
  );
};

export default UserActions;
