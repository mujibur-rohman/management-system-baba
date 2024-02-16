"use client";

import AppWrapper from "@/components/app-wrapper";
import { DataTable } from "@/components/data-table";
import Paginate from "@/components/paginate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberService from "@/services/member/member.service";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import AddMember from "./_components/add-member";

function MemberPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const debouncedValue = useDebounce<string>(search, 300);

  const {
    data: members,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["member", currentPage, debouncedValue],
    queryFn: async () => {
      return await MemberService.getMyMember({ limit: 10, page: currentPage, q: debouncedValue, type: "table" });
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

  return (
    <AppWrapper className="pb-20">
      <div className="py-5 flex justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Member</h1>
        <AddMember />
      </div>
      <div className="border rounded-lg p-5">
        <div className="flex justify-between mb-4">
          <Input className="w-[180px]" placeholder="Search" value={search} onChange={handleChange} />
          {/* <SelectFilter /> */}
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
        ) : (
          <>
            <DataTable columns={columns} data={members?.data} />
            <div className="mt-5">
              <Paginate currentPage={currentPage} handlePageChange={handlePageChange} totalPages={members?.totalPage} visiblePage={3} />
            </div>
          </>
        )}
      </div>
    </AppWrapper>
  );
}

export default MemberPage;
