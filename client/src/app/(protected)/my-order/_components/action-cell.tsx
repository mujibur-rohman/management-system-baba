import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2Icon, CheckIcon, Edit2Icon, Loader2Icon, MoreHorizontalIcon, TrashIcon, Wallet2Icon } from "lucide-react";
import React, { useState } from "react";
import ContentEdit from "./content-edit";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import OrderService from "@/services/order/order.service";
import AmountForm from "./amount-form";
import useAuth from "@/hooks/useAuth";

function ActionCellMyOrder({ order }: { order: OrderTypes }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeAction, setTypeAction] = useState<"confirm" | "edit" | "amount" | "delete" | null>(null);

  const queryClient = useQueryClient();
  const auth = useAuth();

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      switch (typeAction) {
        case "delete":
          const deleteResponse = await OrderService.deleteOrder(order.id);
          queryClient.invalidateQueries();
          toast.success(deleteResponse.message);
          break;
        case "confirm":
          const confirmResponse = await OrderService.confirmOrder({
            id: order.id,
            payload: {
              cart: JSON.parse(order.cartData),
            },
          });
          queryClient.invalidateQueries();
          toast.success(confirmResponse.message);
          break;
        default:
          break;
      }
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const renderContent = (val: typeof typeAction) => {
    switch (val) {
      case "amount":
        return <AmountForm setDialog={setOpenDialog} order={order} />;
      case "confirm":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
              <DialogDescription>Orderan yang sudah dikonfirmasi tidak dapat dihapus dan diubah lagi, udah dicek lagi?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col md:flex-row gap-3 md:gap-0">
              <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
                Batal
              </Button>
              <Button disabled={isLoading} onClick={handleConfirm} variant="success" size="sm">
                {isLoading ? <Loader2Icon className="animate-spin" /> : "Konfirmasi"}
              </Button>
            </DialogFooter>
          </>
        );
      case "delete":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Hapus Orderan</DialogTitle>
              <DialogDescription>Apakah yakin ingin menghapus orderan ini?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col md:flex-row gap-3 md:gap-0">
              <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
                Batal
              </Button>
              <Button disabled={isLoading} onClick={handleConfirm} variant="destructive" size="sm">
                {isLoading ? <Loader2Icon className="animate-spin" /> : "Yakin"}
              </Button>
            </DialogFooter>
          </>
        );
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
          {!order.isConfirm ? (
            <>
              {auth?.user?.parentId ? null : (
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDialog(true);
                    setTypeAction("confirm");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2Icon className="w-4 h-4 text-foreground" /> Konfirmasi
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog(true);
                  setTypeAction("edit");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit2Icon className="w-4 h-4 text-foreground" /> Ubah Pesanan
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
                    <span>Batalkan Pesanan</span>
                  </>
                </DialogTrigger>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setOpenDialog(true);
                setTypeAction("amount");
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Wallet2Icon className="w-4 h-4 text-foreground" /> Pembayaran
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">{renderContent(typeAction)}</DialogContent>
    </Dialog>
  );
}

export default ActionCellMyOrder;
