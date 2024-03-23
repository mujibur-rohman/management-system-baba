import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2Icon, CheckIcon, Edit2Icon, EyeIcon, Loader2Icon, MoreHorizontalIcon, TrashIcon, Wallet2Icon } from "lucide-react";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import OrderService from "@/services/order/order.service";
import useAuth from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentEdit from "@/app/(protected)/my-order/_components/content-edit";
import AmountForm from "@/app/(protected)/my-order/_components/amount-form";
import { useParams } from "next/navigation";

function ActionCelOrderTeam({ order }: { order: OrderTypes }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeAction, setTypeAction] = useState<"confirm" | "edit" | "amount" | "delete" | "detail" | null>(null);

  const queryClient = useQueryClient();
  const auth = useAuth();
  const params = useParams();

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
              memberUserId: parseInt(params.memberId as string),
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
      case "detail":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Order</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col justify-between">
              <div className="flex justify-between py-2">
                <p>Nomor Pesanan</p>
                <p className="font-medium">{order.noOrder}</p>
              </div>
              <div className="flex justify-between py-2">
                <p>Kuantiti</p>
                <p className="font-medium">
                  {(JSON.parse(order.cartData) as Cart[]).reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.qty * 1;
                  }, 0)}
                </p>
              </div>
              <div className="flex justify-between py-2">
                <p>Total Harga</p>
                <p className="font-medium">{order.totalPrice}</p>
              </div>
              <Separator />
              <p className="mt-3 font-medium text-lg">Daftar Aroma</p>
              <ScrollArea className="max-h-56 px-4 flex flex-col gap-4 border rounded-md mt-3">
                {(JSON.parse(order.cartData) as Cart[]).map((cart) => (
                  <div key={cart.id} className="flex justify-between py-3 border-b last:border-none">
                    <p className="text-sm">{cart.product.aromaLama}</p>
                    <span>{cart.qty}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </>
        );
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
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog(true);
                  setTypeAction("confirm");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2Icon className="w-4 h-4 text-foreground" /> Konfirmasi
              </DropdownMenuItem>
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
            <>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog(true);
                  setTypeAction("detail");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <EyeIcon className="w-4 h-4 text-foreground" /> Detail
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">{renderContent(typeAction)}</DialogContent>
    </Dialog>
  );
}

export default ActionCelOrderTeam;
