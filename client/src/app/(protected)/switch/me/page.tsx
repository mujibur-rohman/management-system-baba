"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import Paginate from "@/components/paginate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import React, { useState } from "react";
import { columns } from "./_components/columns";
import ProductService from "@/services/product/product.service";

function MySwitch() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: switches,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-switch", currentPage],
    queryFn: async () => {
      return await ProductService.getSwitch({ limit: 10, page: currentPage, type: "self" });
    },
  });

  //* handle change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Riwayat Penukaran Saya</h1>
      </div>

      <div className="border rounded-lg p-5">
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
        ) : switches?.totalRows === 0 ? (
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p>Tidak ada penukaran</p>
            </div>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={switches?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={switches?.totalPage} visiblePage={3} />
            </div>
          </>
        )}
      </div>
    </AppWrapper>
  );
}

export default MySwitch;
