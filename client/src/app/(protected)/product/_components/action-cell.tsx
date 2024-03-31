import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ProductService from "@/services/product/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ActionCellProduct({ id, stock }: { id: number; stock: number }) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(stock.toString());

  const queryClient = useQueryClient();

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await ProductService.updateStock({ id, stock: parseInt(value) });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Stok berhasil di ubah");
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
          Perbarui
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Stok</DialogTitle>
          <DialogDescription>Stok ini akan diubah secara manual</DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === "") {
              setValue(inputValue);
              return;
            }
            if (inputValue.startsWith("0") && value.length < 1) {
              console.log(inputValue);
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
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Yakin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActionCellProduct;
