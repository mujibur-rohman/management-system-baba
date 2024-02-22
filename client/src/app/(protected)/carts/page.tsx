"use client";

import AppWrapper from "@/components/app-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import ProductService from "@/services/product/product.service";
import { useQuery } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import React from "react";
import CartList from "./_components/cart-list";

function CartsPage() {
  const { data: carts, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      return await ProductService.getCarts();
    },
  });
  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Pesanan</h1>
      </div>
      <div className="border rounded-lg p-5 flex flex-col gap-5">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <CartList carts={carts} />
        )}
      </div>
    </AppWrapper>
  );
}

export default CartsPage;
