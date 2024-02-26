import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CartItem from "../../carts/_components/cart-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import formatCurrency from "@/lib/format-currency";
import OrderService from "@/services/order/order.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function ContentEdit({ carts, orderId, setDialog }: { carts: Cart[]; orderId: number; setDialog: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { control } = useForm({ defaultValues: { carts: carts } });
  const { fields: fieldsCart, remove } = useFieldArray({
    control,
    name: "carts",
    keyName: "_id",
  });

  const queryClient = useQueryClient();

  const [isLoading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: number]: any }>(Object.fromEntries(fieldsCart.map((cart, index) => [cart._id, cart.qty])));

  const updateQty = (key: string, newValue: string) => {
    if (parseInt(newValue) < 0) return;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [key]: newValue,
    }));
  };

  const getTotalPrice = () => {
    return fieldsCart.reduce((total: number, cart: any) => {
      return total + parseInt(cart.price) * quantities[cart._id];
    }, 0);
  };

  const getTotalStock = () => {
    return fieldsCart.reduce((total: number, cart: any) => {
      return total + parseInt(quantities[cart._id]);
    }, 0);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ubah Pesanan</DialogTitle>
        <DialogDescription>Hanya bisa mengubah jumlah aroma, tidak mengganti atau menambah aroma!</DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-80 pr-2 flex flex-col gap-4 border pl-4 rounded-md">
        {fieldsCart.length ? (
          fieldsCart?.map((cart, i) => (
            <div key={cart.id} className="py-4 border-b last:border-none">
              <CartItem isClient={true} remove={remove} cart={cart} i={fieldsCart.findIndex((c) => c.id === cart.id)} quantities={quantities} updateQty={updateQty} />
            </div>
          ))
        ) : (
          <div className="mt-10 text-center">
            <p className="text-center">Kosong!</p>
          </div>
        )}
      </ScrollArea>

      <div className="flex gap-3 justify-between">
        <span className="font-bold flex flex-col">
          <span className="text-lg">{formatCurrency(getTotalPrice())}</span> <span className="text-blue-500">({getTotalStock()} Item)</span>
        </span>
        <Button
          onClick={async () => {
            try {
              setLoading(true);
              const res = await OrderService.updateOrder({
                id: orderId,
                payload: {
                  remainingAmount: getTotalPrice().toString(),
                  totalPrice: getTotalPrice().toString(),
                  cart: fieldsCart.map((c: any) => ({
                    ...c,
                    qty: quantities[c._id],
                  })),
                },
              });

              toast.success(res.message);
              setDialog(false);
              queryClient.invalidateQueries();
            } catch (error: any) {
              if (error?.response?.data) {
                toast.error(error.response.data.message);
                return;
              }
              toast.error(error.message);
            } finally {
              setLoading(false);
            }
          }}
          className="self-end"
          disabled={isLoading || fieldsCart.length === 0}
          variant="success"
          size="sm"
        >
          {isLoading ? <Loader2Icon className="animate-spin" /> : "Simpan"}
        </Button>
      </div>
    </>
  );
}

export default ContentEdit;
