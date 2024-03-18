"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import Paginate from "@/components/paginate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrderService from "@/services/order/order.service";
import { useQuery } from "@tanstack/react-query";
import { HandCoinsIcon, RefreshCwIcon } from "lucide-react";
import React, { useState } from "react";
import formatCurrency from "@/lib/format-currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentMonth, getMonthsList, getYearsList } from "@/lib/utils";
import { columns } from "./_components/columns";
import Link from "next/link";

function FeePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState<string>(getCurrentMonth());
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  const {
    data: fees,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-fee", currentPage, monthFilter, yearFilter],
    queryFn: async () => {
      return await OrderService.getFees({ limit: 10, page: currentPage, month: monthFilter, year: yearFilter });
    },
  });

  //* handle change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Fee</h1>
      </div>
      <div className="flex gap-3 mb-5 w-fit">
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Total Fee Bulan Ini</span>
            <span className="text-destructive font-bold text-xl">{formatCurrency(fees?.totalFee || 0) || "..."}</span>
          </div>
          <HandCoinsIcon />
        </div>
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-sm">Mau liat fee seluruh tim?</span>
            <Button asChild variant="success" size="sm">
              <Link href="/fee/team">Klik disini</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-4 justify-between">
          <div className="flex gap-3">
            <Select
              onValueChange={(val) => {
                setMonthFilter(val);
              }}
              value={monthFilter}
            >
              <SelectTrigger className="focus:ring-0">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {getMonthsList().map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(val) => {
                setYearFilter(val);
              }}
              value={yearFilter}
            >
              <SelectTrigger className="focus:ring-0">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {getYearsList().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        ) : fees?.totalRows === 0 ? (
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p>Tidak ada fee</p>
            </div>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={fees?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={fees?.totalPage} visiblePage={3} />
            </div>
          </>
        )}
      </div>
    </AppWrapper>
  );
}

export default FeePage;
