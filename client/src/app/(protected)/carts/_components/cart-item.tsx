import { Button } from "@/components/ui/button";
import ProductService from "@/services/product/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";
import { toast } from "sonner";

function CartItem({
  cart,
  quantities,
  updateQty,
  i,
  remove,
  isClient = false,
}: {
  cart: FieldArrayWithId<
    {
      carts: Cart[];
    },
    "carts",
    "_id"
  >;
  updateQty: (key: string, newValue: string) => void;
  quantities: {
    [key: string]: any;
  };
  i: number;
  remove: UseFieldArrayRemove;
  isClient?: boolean;
}) {
  const [isLoadingDel, setIsLoadingDel] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    try {
      setIsLoadingDel(true);
      if (!isClient) {
        const res = await ProductService.deleteCart(id);
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
        await queryClient.invalidateQueries();
        toast.success(res.message);
      } else {
        delete quantities[cart._id];
      }
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
            onClick={() => updateQty(cart._id, (parseInt(quantities[cart._id]) - 1).toString())}
            className="bg-foreground text-background cursor-pointer hover:bg-foreground/60 w-7 text-center rounded font-bold"
          >
            -
          </div>
          <input
            className="bg-transparent w-12 outline-none text-center"
            value={quantities[cart._id]}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                if (!e.target.value) {
                  updateQty(cart._id, "0");
                  return;
                }
                const trimmedValue = e.target.value.replace(/^0+/, "");
                updateQty(cart._id, trimmedValue);
              }
            }}
          />
          <div
            onClick={() => updateQty(cart._id, (parseInt(quantities[cart._id]) + 1).toString())}
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
