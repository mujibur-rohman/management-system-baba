"use client";

import AppWrapper from "@/components/app-wrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductService from "@/services/product/product.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRightIcon, HistoryIcon, Loader2Icon, Users2Icon } from "lucide-react";
import React, { useState } from "react";
import SelectOldProduct from "./components/select-old-product";

function SwitchPage() {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [valueOldProduct, setValueOldProduct] = React.useState<string>("");

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
  };

  return (
    <AppWrapper>
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Tukar Aroma</h1>
      </div>
      <div className="flex w-full gap-3">
        <Button variant="outline" className="w-full flex items-center justify-center gap-3">
          <HistoryIcon />
          <span>Riwayat Saya</span>
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center gap-3">
          <Users2Icon />
          <span>Riwayat Team</span>
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
          <SelectOldProduct products={myProduct ? myProduct : []} value={valueOldProduct} setValue={setValueOldProduct} />
          <div className="w-full"></div>
          <div className="flex justify-end gap-3 md:gap-0">
            <Button variant="secondary" size="sm" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button disabled={isLoading} variant="success" size="sm">
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Yakin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppWrapper>
  );
}

export default SwitchPage;
