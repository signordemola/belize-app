import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicUserData } from "@/types/users";
import { Card } from "@/components/ui/card";

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: BasicUserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit {user.firstName} {user.lastName} Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-4">
              <p>Currently under construction</p>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-4">
              <p>Currently under construction</p>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
