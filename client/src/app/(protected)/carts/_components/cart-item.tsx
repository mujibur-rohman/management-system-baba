import { Button } from "@/components/ui/button";
import ProductService from "@/services/product/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { UseFieldArrayRemove } from "react-hook-form";
import { toast } from "sonner";

function CartItem({
  cart,
  quantities,
  updateQty,
  i,
  remove,
}: {
  cart: Cart;
  updateQty: (index: number, newValue: string) => void;
  quantities: {
    [key: number]: any;
  };
  i: number;
  remove: UseFieldArrayRemove;
}) {
  const [isLoadingDel, setIsLoadingDel] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    try {
      setIsLoadingDel(true);
      console.log(id);
      const res = await ProductService.deleteCart(id);
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    } finally {
      setIsLoadingDel(false);
    }
  };

  return (
    <div key={cart.id} className="flex justify-between border-b pb-5 last:border-none last:pb-0">
      <div className="space-y-3">
        <span className="text-sm">
          {cart.product.aromaLama} / {cart.product.aromaBaru}
        </span>
        <div className="flex gap-4 self-start">
          <div
            onClick={() => updateQty(i, (parseInt(quantities[i]) - 1).toString())}
            className="bg-foreground text-background cursor-pointer hover:bg-foreground/60 w-7 text-center rounded font-bold"
          >
            -
          </div>
          <input
            className="bg-transparent w-12 outline-none text-center"
            value={quantities[i]}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                if (!e.target.value) {
                  updateQty(i, "0");
                  return;
                }
                const trimmedValue = e.target.value.replace(/^0+/, "");
                updateQty(i, trimmedValue);
              }
            }}
          />
          <div
            onClick={() => updateQty(i, (parseInt(quantities[i]) + 1).toString())}
            className="bg-foreground text-background cursor-pointer hover:bg-foreground/60 w-7 text-center rounded font-bold"
          >
            +
          </div>
        </div>
      </div>
      <Button
        className="bg-transparent hover:bg-transparent"
        disabled={isLoadingDel}
        onClick={() => {
          handleDelete(cart.id);
          remove(i);
        }}
      >
        <TrashIcon className="text-destructive cursor-pointer" />
      </Button>
    </div>
  );
}

export default CartItem;
