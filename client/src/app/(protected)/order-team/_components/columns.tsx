"use client";

import BadgeStatus from "@/components/badge-status";
import { Button } from "@/components/ui/button";
import { STATUS_MEMBER } from "@/services/auth/auth.types";
import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import Link from "next/link";

export const columns: ColumnDef<MemberTypesProfile>[] = [
  {
    accessorKey: "idMember",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Status",
    cell: ({ row }) => {
      return <BadgeStatus role={row.original.role.toUpperCase() as keyof typeof STATUS_MEMBER} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button asChild variant="warning" size="sm">
          <Link className="text-xs" href={`/order-team/${row.original.id}`}>
            Lihat Orderan
          </Link>
        </Button>
      );
    },
  },
];
