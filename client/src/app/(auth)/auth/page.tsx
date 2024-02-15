"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  idMember: z.string().min(1, "id member harus diisi"),
  password: z.string().min(6, "minimal 6 karakter"),
});

function AuthPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idMember: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const auth = new AuthService();
      await auth.login(values.idMember, values.password);
      router.replace("/");
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full md:max-w-[50vw] xl:max-w-[30vw] max-xl:max-w-[500px] border rounded-md p-3">
        <div className="flex justify-center mb-5 border-b pb-3">
          <span className="text-primary font-bold text-xl">Login</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-b pb-3">
            <FormField
              control={form.control}
              name="idMember"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Member</FormLabel>
                  <FormControl>
                    <Input
                      className={cn({
                        "border-destructive": form.formState.errors.idMember,
                      })}
                      placeholder="ID Member"
                      {...field}
                    />
                  </FormControl>
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
                      className={cn({
                        "border-destructive": form.formState.errors.password,
                      })}
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit" className="!mt-4">
              Login
            </Button>
          </form>
        </Form>
        <div className="flex justify-center pt-3">
          <span className="text-primary font-bold text-xl">BABA Parfum</span>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
