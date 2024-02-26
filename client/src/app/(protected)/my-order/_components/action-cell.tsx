import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2Icon, CheckIcon, Edit2Icon, Loader2Icon, MoreHorizontalIcon, TrashIcon, Wallet2Icon } from "lucide-react";
import React, { useState } from "react";
import ContentEdit from "./content-edit";

function ActionCellMyOrder({ order }: { order: OrderTypes }) {
  const [isOpenDialog, setOpenDialog] = useState(false);

  const [typeAction, setTypeAction] = useState<"confirm" | "edit" | "amount" | "delete" | null>(null);

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const renderContent = (val: typeof typeAction) => {
    switch (val) {
      case "amount":
        return <div>Amount</div>;
      case "confirm":
        return <div>Confirm</div>;
      case "delete":
        return <div>Delete</div>;
      case "edit":
        return <ContentEdit setDialog={setOpenDialog} carts={JSON.parse(order.cartData) as Cart[]} orderId={order.id} />;
      default:
        return <div>-</div>;
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
              setTypeAction("edit");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Edit2Icon className="w-4 h-4 text-foreground" /> Ubah Pesanan
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setOpenDialog(true);
              setTypeAction("edit");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Wallet2Icon className="w-4 h-4 text-foreground" /> Pembayaran
          </DropdownMenuItem> */}
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
          <DropdownMenuItem
            onClick={() => {
              setOpenDialog(true);
              setTypeAction("edit");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2Icon className="w-4 h-4 text-foreground" /> Konfirmasi
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">{renderContent(typeAction)}</DialogContent>
    </Dialog>
  );
}

export default ActionCellMyOrder;
