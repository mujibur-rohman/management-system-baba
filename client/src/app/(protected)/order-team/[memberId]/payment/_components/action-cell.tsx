import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import PaymentType from "@/services/order/payment.types";
import { useQueryClient } from "@tanstack/react-query";
import OrderService from "@/services/order/order.service";

function ActionCellPayment({ payment }: { payment: PaymentType }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const confirmResponse = await OrderService.amountOrder(payment.id);
      queryClient.invalidateQueries();
      toast.success(confirmResponse.message);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        setLoading(false);
        setOpenDialog(false);
        return;
      }
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };
  return (
    <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
      <DialogTrigger asChild>
        <Button variant="warning" size="sm">
          Konfirmasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
      </DialogContent>
    </Dialog>
  );
}

export default ActionCellPayment;
