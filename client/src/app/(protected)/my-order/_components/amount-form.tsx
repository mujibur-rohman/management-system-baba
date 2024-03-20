import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import formatCurrency from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import OrderService from "@/services/order/order.service";
import PaymentType from "@/services/order/payment.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function AmountForm({ order, setDialog, payment }: { payment?: PaymentType; order: OrderTypes; setDialog: React.Dispatch<React.SetStateAction<boolean>> }) {
  const queryClient = useQueryClient();

  const formSchema = z
    .object({
      amountTrf: z.string(),
      amountCash: z.string(),
    })
    .refine((obj) => parseInt(obj.amountCash ? obj.amountCash : "0") + parseInt(obj.amountTrf ? obj.amountTrf : "0") <= parseInt(order.remainingAmount), {
      message: "Jumlah pembayaran melebihi hutang",
      path: ["limit"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountCash: payment?.amountCash ? payment.amountCash : "",
      amountTrf: payment?.amountTrf ? payment.amountTrf : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!payment) {
        const res = await OrderService.addPayment({
          idOrder: order.id,
          amountCash: values.amountCash ? values.amountCash : "0",
          amountTrf: values.amountTrf ? values.amountTrf : "0",
        });

        toast.success(res.message);
      } else {
        const res = await OrderService.editPayment(
          {
            amountCash: values.amountCash ? values.amountCash : "0",
            amountTrf: values.amountTrf ? values.amountTrf : "0",
          },
          payment.id
        );

        toast.success(res.message);
      }
      setDialog(false);
      queryClient.invalidateQueries();
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pembayaran</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="amountCash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cash</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Rp."
                      autoComplete="off"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": (form.formState.errors as any).limit,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountTrf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Rp."
                      autoComplete="off"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": (form.formState.errors as any).limit,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-destructive text-sm">{(form.formState.errors as any).limit?.message}</p>
            <div className="font-bold">Hutang : {formatCurrency(parseInt(order.remainingAmount))}</div>
            <div className="flex justify-end gap-2 pt-3">
              <Button onClick={() => setDialog(false)} type="button" variant="secondary" className="flex gap-2" disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="flex gap-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </DialogHeader>
    </>
  );
}

export default AmountForm;
