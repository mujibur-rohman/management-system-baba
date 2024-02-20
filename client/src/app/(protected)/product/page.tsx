"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import ProductService from "@/services/product/product.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { columns } from "./_components/columns";
import Paginate from "@/components/paginate";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ProductPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingGenerate, setLoadingGenerate] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [typeView, setTypeView] = useState<string>("baru");
  const debouncedValue = useDebounce<string>(search, 300);

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["product", currentPage, debouncedValue, typeView],
    queryFn: async () => {
      return await ProductService.getAll({ limit: 10, page: currentPage, q: debouncedValue, type: typeView });
    },
  });

  //* handle change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //* handle change search
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  //* generate process
  const generate = async () => {
    try {
      setLoadingGenerate(true);
      const res = await ProductService.generate();
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success(res.message);
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    } finally {
      setLoadingGenerate(false);
    }
  };

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Produk & Stok</h1>
      </div>
      <div className="my-3">
        <span className="text-xl font-medium">Total Semua Stok : {products?.totalStock}</span>
      </div>
      <div className="border rounded-lg p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-4 justify-between">
          <div className="flex gap-2 bg-border rounded-md p-1 md:w-[280px] md:order-2">
            <div
              className={cn("rounded-md p-1 w-full text-center font-medium cursor-pointer", {
                "bg-background": typeView === "baru",
              })}
              onClick={() => {
                setTypeView("baru");
                setCurrentPage(1);
              }}
            >
              Baru
            </div>
            <div
              className={cn("rounded-md p-1 w-full text-center font-medium cursor-pointer", {
                "bg-background": typeView === "lama",
              })}
              onClick={() => {
                setTypeView("lama");
                setCurrentPage(1);
              }}
            >
              Lama
            </div>
          </div>
          <Input className="w-[180px] md:order-1" placeholder="Search" value={search} onChange={handleChange} />
        </div>
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
        ) : isError && !isFetching ? (
          <div className="w-full flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <p>Terjadi kesalahan</p>
              <Button size="sm" onClick={() => refetch()}>
                <RefreshCwIcon />
              </Button>
            </div>
          </div>
        ) : products?.totalRows === 0 ? (
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p>Produk belum di generate, silahkan generate terlebih dahulu</p>
              <Button disabled={isLoadingGenerate} variant="destructive" onClick={generate}>
                {isLoadingGenerate ? <Loader2Icon className="animate-spin" /> : "Generate"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={products?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={products?.totalPage} visiblePage={3} />
            </div>
          </>
        )}
      </div>
    </AppWrapper>
  );
}

export default ProductPage;
