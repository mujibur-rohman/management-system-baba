import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { STATUS_MEMBER } from "@/services/auth/auth.types";
import MemberService from "@/services/member/member.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Loader2Icon, PlusIcon } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "nama harus diisi"),
  idMember: z.string().min(1, "id member harus diisi"),
  joinDate: z
    .date()
    .nullable()
    .refine((val) => val, {
      message: "tanggal harus diisi",
    }),
  role: z.string().min(1, "status harus diisi"),
  password: z.string().min(1, "password harus diisi"),
});

function AddMember() {
  const [isOpenDialog, setOpenDialog] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idMember: "",
      joinDate: null,
      name: "",
      role: "",
      password: "babaparfum",
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpenDialog(value);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newMember = await MemberService.addMember(values);
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success(newMember.message);
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
          <PlusIcon className="text-background" /> Member Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Member Baru</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="idMember"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Member</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID Member"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.idMember,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.name,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Join</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal w-full", !field.value && "text-muted-foreground", {
                            "border-destructive outline-destructive !ring-destructive": form.formState.errors.joinDate,
                          })}
                        >
                          {field.value ? moment(field.value).format("LL") : <span>Pilih Tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(STATUS_MEMBER).map((status) => (
                        <SelectItem key={status} value={status} className="capitalize">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Password"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.name,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">Password bawaan, member bisa ubah ketika login</FormDescription>
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

export default AddMember;
