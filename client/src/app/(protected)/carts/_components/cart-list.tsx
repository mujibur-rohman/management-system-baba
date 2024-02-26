import AppWrapper from "@/components/app-wrapper";
import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/format-currency";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CartItem from "./cart-item";
import { toast } from "sonner";
import ProductService from "@/services/product/product.service";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderService from "@/services/order/order.service";

function CartList({ carts }: { carts: { data: Cart[] } | undefined }) {
  const { control } = useForm({ defaultValues: { carts: carts } });
  const { fields: fieldsCart, remove } = useFieldArray({
    control,
    name: "carts.data",
    keyName: "_id",
  });

  const [quantities, setQuantities] = useState<{ [key: number]: any }>(Object.fromEntries(fieldsCart.map((cart) => [cart._id, cart.qty])));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [dataOrder, setDataOrder] = useState({
    noOrder: "",
    qty: "",
    totalPrice: "",
  });

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

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await ProductService.updateCart({
        data: fieldsCart.map((cart: any, i) => ({
          id: cart.id,
          qty: typeof quantities[cart._id] === "string" ? parseInt(quantities[cart._id]) : quantities[cart._id],
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

  const handleOrder = async () => {
    try {
      setIsLoading(true);
      const res = await OrderService.addOrder({
        amountCash: "0",
        amountTrf: "0",
        remainingAmount: getTotalPrice().toString(),
        totalPrice: getTotalPrice().toString(),
      });
      setDataOrder({
        noOrder: res.data.noOrder,
        qty: getTotalStock().toString(),
        totalPrice: getTotalPrice().toString(),
      });
      remove();
      toast.success(res.message);
      setOpenDialog(true);
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
      {/* Dialog Success Info*/}
      <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Order</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-between">
            <div className="flex justify-between py-2">
              <p>Nomor Pesanan</p>
              <p className="font-medium">{dataOrder.noOrder}</p>
            </div>
            <div className="flex justify-between py-2">
              <p>Kuantiti</p>
              <p className="font-medium">{dataOrder.qty}</p>
            </div>
            <div className="flex justify-between py-2">
              <p>Total Harga</p>
              <p className="font-medium">{dataOrder.totalPrice}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" asChild>
              <Link href="/my-order">Cek Orderan</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed gap-3 bottom-0 right-0 left-0 bg-background border-border border py-4 rounded-t-lg">
        <AppWrapper className="flex justify-between items-center">
          <span className="font-bold flex flex-col">
            <span className="text-lg">{formatCurrency(getTotalPrice())}</span> <span className="text-blue-500">({getTotalStock()} Item)</span>
          </span>
          <div className="flex gap-2">
            <Button disabled={!fieldsCart.length || isLoading} size="sm" onClick={handleSave}>
              {isLoading ? "Loading..." : "Save Dulu"}
            </Button>
            <Button onClick={handleOrder} disabled={!fieldsCart.length || isLoading} size="sm" variant="success">
              {isLoading ? "Loading..." : "Gas Order"}
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
