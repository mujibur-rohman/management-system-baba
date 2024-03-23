import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import UserService from "@/services/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    oldPassword: z.string().min(6, "minimal 6 karakter"),
    newPassword: z.string().min(6, "minimal 6 karakter"),
    confirmPassword: z.string().min(6, "minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password harus sama dengan password baru",
    path: ["confirmPassword"],
  });

function UpdatePassword({ setOpen, isOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>; isOpen: boolean }) {
  const session = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await UserService.changePassword({ newPassword: values.newPassword, userId: session!.user!.id, oldPassword: values.oldPassword });

      toast.success("Password berhasil diubah");
      setOpen(false);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChangeWrapper}>
      <Button onClick={() => setOpen(true)} className="w-full flex gap-2">
        <KeyRoundIcon /> Ganti Password
      </Button>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Lama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password Lama"
                      type="password"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.oldPassword,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password Baru"
                      type="password"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.newPassword,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Konfirmasi Password Baru"
                      type="password"
                      {...field}
                      className={cn({
                        "border-destructive outline-destructive !ring-destructive": form.formState.errors.confirmPassword,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
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

export default UpdatePassword;
