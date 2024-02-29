"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import Paginate from "@/components/paginate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrderService from "@/services/order/order.service";
import { useQuery } from "@tanstack/react-query";
import { RefreshCwIcon, WalletIcon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { columns } from "./_components/columns";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import formatCurrency from "@/lib/format-currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentMonth, getMonthsList, getYearsList } from "@/lib/utils";

function MyOrder() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>(getCurrentMonth());
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  const debouncedValue = useDebounce<string>(search, 300);

  const {
    data: orders,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-order", currentPage, debouncedValue, monthFilter, yearFilter],
    queryFn: async () => {
      return await OrderService.getOrders({ limit: 10, page: currentPage, q: debouncedValue, month: monthFilter, year: yearFilter });
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

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Pesanan Saya</h1>
      </div>
      <div className="mb-5 w-fit">
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Total Hutang</span>
            <span className="text-destructive font-bold text-xl">{formatCurrency(orders?.remainingAmount || 0) || "..."}</span>
          </div>
          <WalletIcon />
        </div>
      </div>
      <div className="border rounded-lg p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-4 justify-between">
          <Input className="w-[180px]" placeholder="Search" value={search} onChange={handleChange} />
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
        ) : orders?.totalRows === 0 ? (
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p>Tidak ada orderan</p>
            </div>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={orders?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={orders?.totalPage} visiblePage={3} />
            </div>
          </>
        )}
      </div>
    </AppWrapper>
  );
}

export default MyOrder;
