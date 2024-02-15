import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import UserService from "@/services/user/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(3),
});

function ChangeNameProfile({ defaultName, setOpen, isOpen }: { defaultName: string; setOpen: React.Dispatch<React.SetStateAction<boolean>>; isOpen: boolean }) {
  const session = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await UserService.changeName({ name: values.name, userId: session!.user!.id });
      session!.updateSession({
        ...session!.user!,
        name: values.name,
      });
      toast.success("Nama sudah diubah");
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
        <EditIcon /> Change Name
      </Button>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
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
            <div className="flex justify-end">
              <Button type="submit" className="flex gap-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeNameProfile;
