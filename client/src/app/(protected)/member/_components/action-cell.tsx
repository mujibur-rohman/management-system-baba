import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KeyRoundIcon, Loader2Icon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import MemberService from "@/services/member/member.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function ActionCell({ id }: { id: string }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeAction, setTypeAction] = useState<"reset" | "delete" | null>(null);

  const queryClient = useQueryClient();

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const handleConfirm = async () => {
    setLoading(true);
    switch (typeAction) {
      case "delete":
        const deleteResponse = await MemberService.deleteMember(id);
        queryClient.invalidateQueries({ queryKey: ["member"] });
        toast.success(deleteResponse.message);
        setLoading(false);
        setOpenDialog(false);
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setOpenDialog(true);
              setTypeAction("reset");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <KeyRoundIcon className="w-4 h-4 text-foreground" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setOpenDialog(true);
              setTypeAction("delete");
            }}
          >
            <DialogTrigger asChild>
              <>
                <TrashIcon className="w-4 h-4 text-foreground" />
                <span>Hapus</span>
              </>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{typeAction === "delete" ? "Hapus Member" : "Reset Password"}</DialogTitle>
          <DialogDescription>{typeAction === "delete" ? "Apakah yakin ingin menghapus member ini?" : "Apakah yakin ingin mereset password member ini?"}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row gap-3 md:gap-0">
          <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
            Batal
          </Button>
          <Button disabled={isLoading} onClick={handleConfirm} variant="destructive" size="sm">
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Yakin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionCell;
