import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PRICE_MEMBER } from "@/config/app.config";
import useAuth from "@/hooks/useAuth";
import ProductService from "@/services/product/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ActionCellOrder({
  id,
  cart,
}: {
  id: number;
  cart?: {
    stock: number;
    qty: number;
    price: string;
    userId: number;
  }[];
}) {
  const auth = useAuth();
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const queryClient = useQueryClient();

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };
  const price = auth?.user?.role as keyof typeof PRICE_MEMBER;

  const handleConfirm = async () => {
    try {
      if (value && value !== "0") {
        setLoading(true);
        const ordered = await ProductService.addToCart({ productId: id, qty: parseInt(value), price: PRICE_MEMBER[price] });
        queryClient.invalidateQueries({ queryKey: ["cart", "order"] });
        toast.success(ordered.message);
        setLoading(false);
        setOpenDialog(false);
        return;
      }
      toast.error("isi jumlahnya");
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        setLoading(false);
        setOpenDialog(false);
        return;
      }
      toast.error(error.message);
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
      {!cart?.find((c) => c.userId === auth?.user?.id) ? (
        <DialogTrigger asChild>
          <Button variant="warning" className="flex gap-2 text-xs" size="sm">
            <ShoppingCart className="w-4 h-4" />
            Masukin Keranjang
          </Button>
        </DialogTrigger>
      ) : (
        <Badge variant="secondary">Ada Dikeranjang</Badge>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Taro Keranjang</DialogTitle>
          <DialogDescription>Jumlah yang mau dimasukkin</DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === "") {
              setValue(inputValue);
              return;
            }
            if (/^[0-9]*$/.test(inputValue) && !inputValue.startsWith("0")) {
              setValue(inputValue);
            }
          }}
        />
        <DialogFooter className="flex flex-col md:flex-row gap-3 md:gap-0">
          <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
            Batal
          </Button>
          <Button disabled={isLoading} onClick={handleConfirm} variant="success" size="sm">
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Masukin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionCellOrder;
