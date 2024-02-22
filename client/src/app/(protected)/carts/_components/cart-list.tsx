import AppWrapper from "@/components/app-wrapper";
import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/format-currency";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CartItem from "./cart-item";
import { toast } from "sonner";
import ProductService from "@/services/product/product.service";
import Link from "next/link";

function CartList({ carts }: { carts: { data: Cart[] } | undefined }) {
  const { control, handleSubmit } = useForm({ defaultValues: { carts: carts } });
  const { fields: fieldsCart, remove } = useFieldArray({
    control,
    name: "carts.data",
    keyName: "_id",
  });

  const [quantities, setQuantities] = useState<{ [key: number]: any }>(Object.fromEntries(fieldsCart.map((cart, index) => [index, cart.qty])));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateQty = (index: number, newValue: string) => {
    if (parseInt(newValue) < 0) return;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [index]: newValue,
    }));
  };

  const getTotalPrice = () => {
    return fieldsCart.reduce((total: number, cart: Cart, index) => {
      return total + parseInt(cart.price) * quantities[index];
    }, 0);
  };

  const getTotalStock = () => {
    return fieldsCart.reduce((total: number, cart: Cart, index) => {
      return total + parseInt(quantities[index]);
    }, 0);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await ProductService.updateCart({
        data: fieldsCart.map((cart, i) => ({
          id: cart.id,
          qty: typeof quantities[i] === "string" ? parseInt(quantities[i]) : quantities[i],
          price: cart.price,
        })),
      });
      toast.success(res.message);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="fixed gap-3 bottom-0 right-0 left-0 bg-background border-border border py-4 rounded-t-lg">
        <AppWrapper className="flex justify-between items-center">
          <span className="font-bold flex flex-col">
            <span className="text-lg">{formatCurrency(getTotalPrice())}</span> <span className="text-blue-500">({getTotalStock()} Item)</span>
          </span>
          <div className="flex gap-2">
            <Button disabled={!fieldsCart.length || isLoading} size="sm" onClick={handleSave}>
              {isLoading ? "Loading..." : "Save Dulu"}
            </Button>
            <Button disabled={!fieldsCart.length} size="sm" variant="success">
              Gas Order
            </Button>
          </div>
        </AppWrapper>
      </div>
      {fieldsCart.length ? (
        fieldsCart?.map((cart, i) => <CartItem key={cart.id} remove={remove} cart={cart} i={i} quantities={quantities} updateQty={updateQty} />)
      ) : (
        <div className="space-y-2 text-center">
          <p className="text-center">Belum ada pesenan ya bre!</p>
          <Button asChild variant="outline">
            <Link href="/order">Belanja Dulu</Link>
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

export default CartList;
