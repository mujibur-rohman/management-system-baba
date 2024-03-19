import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import OrderService from "@/services/order/order.service";
import ProductService from "@/services/product/product.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUpIcon, CheckIcon, Loader2Icon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  customerName: z.string().min(1, "nama customer harus diisi"),
  qty: z.string().min(1, "jumlah harus diisi"),
  productId: z
    .number()
    .nullable()
    .refine((val) => val, {
      message: "aroma belum dipilih",
    }),
});

const topSeller = ["RR02", "2X07", "RR04", "BT01", "BB05", "2X06"];

function AddClosing() {
  const [isOpenDialog, setOpenDialog] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      qty: "",
      productId: null,
    },
  });

  const { data: myProduct, isError } = useQuery({
    queryKey: ["product-all"],
    queryFn: async () => {
      return await ProductService.getAllOptions();
    },
  });

  const mapping = myProduct?.map((prod) => ({
    value: prod.id,
    label: `${prod.aromaLama} / ${prod.aromaBaru}`,
    stock: prod.stock,
  }));

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const selectedProduct = myProduct?.find((prod) => prod.id === values.productId);
      const newClosing = await OrderService.addClosing({
        ...values,
        totalPrice: topSeller.includes(selectedProduct?.codeProduct as string) ? (150000 * parseInt(values.qty)).toString() : (70000 * parseInt(values.qty)).toString(),
        qty: parseInt(values.qty),
      });
      queryClient.invalidateQueries();
      toast.success(newClosing.message);
      setOpenDialog(false);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={openChangeWrapper}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpenDialog(true)}>
          <PlusIcon className="text-background" /> Tambah Closingan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Closingan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Customer</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Nama Customer"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.customerName,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Aroma</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between w-full", { "border-destructive outline-destructive !ring-destructive": form.formState.errors.productId })}
                        >
                          <>
                            {field.value ? mapping?.find((prod) => prod.value === field.value)?.label : "Pilih aroma..."}
                            <ArrowDownUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[300px] w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari aroma..." />
                        <CommandList>
                          <CommandEmpty>Aroma tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {mapping?.map((prod) => (
                              <CommandItem
                                value={prod.label}
                                key={prod.value}
                                onSelect={() => {
                                  form.setValue("productId", prod.value);
                                  form.clearErrors("productId");
                                }}
                                className={cn(field.value === prod.value ? "bg-blue-500 text-white" : "")}
                              >
                                <CheckIcon className={cn("mr-2 h-4 w-4", prod.value === field.value ? "opacity-100" : "opacity-0")} />
                                {prod.label} (Stok: {prod.stock})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === "") {
                          form.setValue("qty", inputValue);
                          return;
                        }
                        if (/^[0-9]*$/.test(inputValue) && !inputValue.startsWith("0")) {
                          form.setValue("qty", inputValue);
                          form.clearErrors("qty");
                        }
                      }}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.qty,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-3">
              <Button onClick={() => setOpenDialog(false)} type="button" variant="secondary" className="flex gap-2" disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="flex gap-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddClosing;
