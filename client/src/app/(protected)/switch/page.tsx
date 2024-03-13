"use client";

import AppWrapper from "@/components/app-wrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductService from "@/services/product/product.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRightIcon, HistoryIcon, Loader2Icon, Users2Icon } from "lucide-react";
import React, { useState } from "react";
import SelectProduct from "./components/select-product";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

function SwitchPage() {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [valueOldProduct, setValueOldProduct] = React.useState<string>("");
  const [valueNewProduct, setValueNewProduct] = React.useState<string>("");
  const [qty, setQty] = React.useState<string>("");

  const { data: myProduct, isError } = useQuery({
    queryKey: ["product-all"],
    queryFn: async () => {
      return await ProductService.getAllOptions();
    },
  });

  const { data: parentProduct } = useQuery({
    queryKey: ["product-parent"],
    queryFn: async () => {
      return await ProductService.getAllParentOptions();
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
    setValueNewProduct("");
    setValueOldProduct("");
    setQty("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (valueNewProduct && valueOldProduct && qty) {
        const addSwitch = await ProductService.addSwitch({
          newCodeProduct: valueNewProduct.toUpperCase(),
          oldCodeProduct: valueOldProduct.toUpperCase(),
          qty: parseInt(qty),
        });

        toast.success(addSwitch.message);
        setOpenDialog(false);
      }
      setLoading(false);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        setLoading(false);
        return;
      }
      setOpenDialog(false);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <AppWrapper>
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Tukar Aroma</h1>
      </div>
      <div className="flex w-full gap-3">
        <Button asChild variant="outline">
          <Link href="switch/me" className="w-full flex items-center justify-center gap-3">
            <HistoryIcon />
            <span>Riwayat Saya</span>
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="switch/team" className="w-full flex items-center justify-center gap-3">
            <Users2Icon />
            <span>Riwayat Tim</span>
          </Link>
        </Button>
      </div>
      <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
        <DialogTrigger asChild>
          <Button variant="success" className="w-full flex items-center justify-center gap-3 mt-5">
            <ArrowLeftRightIcon />
            <span>Tukar Aroma</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tukar Aroma</DialogTitle>
          </DialogHeader>
          <div>
            <label>Aroma Yang Ditukar</label>
            <SelectProduct products={myProduct ? myProduct : []} value={valueOldProduct} setValue={setValueOldProduct} />
          </div>
          <div>
            <label>Ditukar dengan</label>
            <SelectProduct products={parentProduct ? parentProduct : []} value={valueNewProduct} setValue={setValueNewProduct} />
          </div>
          <div>
            <label>Jumlah Penukaran</label>
            <Input
              value={qty}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === "") {
                  setQty(inputValue);
                  return;
                }
                if (/^[0-9]*$/.test(inputValue) && !inputValue.startsWith("0")) {
                  setQty(inputValue);
                }
              }}
              placeholder="0"
            />
          </div>
          <div className="w-full"></div>
          <div className="flex justify-end gap-3 md:gap-0">
            <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit} variant="success" size="sm">
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Tukar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppWrapper>
  );
}

export default SwitchPage;
