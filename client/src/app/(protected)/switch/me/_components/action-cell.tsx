import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import ProductService from "@/services/product/product.service";
import { SwitchType } from "@/services/product/switch.types";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2Icon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ActionCellSwitch({ switchData, memberId }: { switchData: SwitchType; memberId?: number }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [typeAction, setTypeAction] = useState<"confirm" | "edit" | "delete" | null>(null);

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
          const deleteResponse = await ProductService.deleteSwitch(switchData.id);
          queryClient.invalidateQueries();
          toast.success(deleteResponse.message);
          break;
        case "confirm":
          const confirmResponse = await ProductService.confirmSwitch({
            id: switchData.id,
            payload: {
              oldCodeProduct: switchData.oldCodeProduct,
              newCodeProduct: switchData.newCodeProduct,
              qty: switchData.qty,
              memberId,
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
      case "confirm":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
              <DialogDescription>Data yang sudah dikonfirmasi tidak dapat dihapus dan diubah lagi, udah dicek lagi?</DialogDescription>
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
              <DialogTitle>Hapus</DialogTitle>
              <DialogDescription>Apakah yakin ingin menghapus ini?</DialogDescription>
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
        return "edit";
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
          {!switchData.isConfirm ? (
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
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">{renderContent(typeAction)}</DialogContent>
    </Dialog>
  );
}

export default ActionCellSwitch;
