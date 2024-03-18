"use client";

import BadgeStatus from "@/components/badge-status";
import { STATUS_MEMBER } from "@/services/auth/auth.types";
import MemberTypesProfile from "@/services/member/member.type";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "total",
    header: "Fee Bulan Ini",
    cell: ({ row }) => {
      const totalFee = row.original.fee?.reduce((total, order) => total + parseInt(order.fee), 0);
      return totalFee || 0;
    },
  },
];
