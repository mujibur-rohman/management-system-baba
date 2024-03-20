import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2Icon, Edit2Icon, Loader2Icon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import OrderService from "@/services/order/order.service";
import AmountForm from "../../my-order/_components/amount-form";
import PaymentType from "@/services/order/payment.types";
import useAuth from "@/hooks/useAuth";

function ActionCellMyPayment({ payment }: { payment: PaymentType }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeAction, setTypeAction] = useState<"edit" | "delete" | "confirm" | null>(null);

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
          const deleteResponse = await OrderService.deletePayment(payment.id);
          queryClient.invalidateQueries();
          toast.success(deleteResponse.message);
          break;
        case "confirm":
          const confirmResponse = await OrderService.amountOrder(payment.id);
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
      case "edit":
        return <AmountForm setDialog={setOpenDialog} order={payment.order} payment={payment} />;
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
      case "confirm":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
              <DialogDescription>Payment yang sudah dikonfirmasi tidak dapat dihapus, udah dicek lagi?</DialogDescription>
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
            <Edit2Icon className="w-4 h-4 text-foreground" /> Ubah Pembayaran
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
      <DialogContent className="sm:max-w-[425px]">{renderContent(typeAction)}</DialogContent>
    </Dialog>
  );
}

export default ActionCellMyPayment;
