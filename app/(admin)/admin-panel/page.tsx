import UserActions from "@/components/admin/user-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/lib/admin/dal";
import { getFormattedDateTime } from "@/lib/utils";
import React, { Suspense } from "react";

const AdminPanel = async () => {
  const users = await getAllUsers();

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length ? (
                users.map((user) => {
                  const { date } = getFormattedDateTime(user.createdAt);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <span className="capitalize">{user.firstName}</span>{" "}
                        <span className="capitalize">{user.lastName}</span>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "destructive"}
                        >
                          {user.isActive ? "Active" : "Deactivated"}
                        </Badge>
                      </TableCell>
                      <TableCell>{date} </TableCell>
                      <TableCell className="text-right">
                        <UserActions user={user} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
