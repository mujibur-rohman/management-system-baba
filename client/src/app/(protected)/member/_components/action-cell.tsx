import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KeyRoundIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";

function ActionCell() {
  const [isOpenDialog, setOpenDialog] = useState(false);

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
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
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <KeyRoundIcon className="w-4 h-4 text-foreground" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setOpenDialog(true)}>
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
          <DialogTitle>Hapus Member</DialogTitle>
          <DialogDescription>Apakah yakin ingin menghapus member ini?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row gap-3 md:gap-0">
          <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
            Batal
          </Button>
          <Button variant="destructive" size="sm">
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionCell;
