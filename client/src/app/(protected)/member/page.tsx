"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import Paginate from "@/components/paginate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberService from "@/services/member/member.service";
import { useQuery } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { columns } from "./_components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import AddMember from "./_components/add-member";
import { cn } from "@/lib/utils";
import Hierarchy from "./_components/hierarchy";

function MemberPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [typeView, setTypeView] = useState<"table" | "hierarchy">("table");
  const debouncedValue = useDebounce<string>(search, 300);

  const {
    data: members,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["member", currentPage, debouncedValue, typeView],
    queryFn: async () => {
      return await MemberService.getMyMember({ limit: 2, page: currentPage, q: debouncedValue, type: typeView });
    },
  });

  //* handle change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //* handle change search
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  console.log(members);

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Member</h1>
        <AddMember />
      </div>
      <div className="my-3">
        <span className="text-xl font-medium">Total Member : {members?.totalRows}</span>
      </div>
      <div className="border rounded-lg p-5">
        <div
          className={cn("flex flex-col md:flex-row gap-3 mb-4", {
            "justify-between": typeView === "table",
            "justify-end": typeView === "hierarchy",
          })}
        >
          <div className="flex gap-2 bg-border rounded-md p-1 md:w-[280px] md:order-2">
            <div
              className={cn("rounded-md p-1 w-full text-center font-medium cursor-pointer", {
                "bg-background": typeView === "table",
              })}
              onClick={() => setTypeView("table")}
            >
              Tabel
            </div>
            <div
              className={cn("rounded-md p-1 w-full text-center font-medium cursor-pointer", {
                "bg-background": typeView === "hierarchy",
              })}
              onClick={() => setTypeView("hierarchy")}
            >
              Hirarki
            </div>
          </div>
          <Input className={cn("w-[180px] md:order-1", { hidden: typeView === "hierarchy" })} placeholder="Search" value={search} onChange={handleChange} />
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
        ) : typeView === "table" ? (
          <>
            <DataTable columns={columns} data={members?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={members?.totalPage} visiblePage={3} />
            </div>
          </>
        ) : (
          <Hierarchy members={members} />
        )}
      </div>
    </AppWrapper>
  );
}

export default MemberPage;
