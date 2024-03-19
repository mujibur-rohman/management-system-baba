"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import moment from "moment";
import formatCurrency from "@/lib/format-currency";

export const columns: ColumnDef<ProfitType>[] = [
  {
    accessorKey: "noOrder",
    header: "Nama",
    cell: ({ row }) => {
      return row.original.name || "-";
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{moment(row.original.incomeDate).format("LL")}</span>;
    },
  },
  {
    accessorKey: "time",
    header: "Jam",
    cell: ({ row }) => {
      const hours = new Date(row.original.createdAt).getHours().toString().padStart(2, "0");
      const minutes = new Date(row.original.createdAt).getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
  },
  {
    accessorKey: "qty",
    header: "Jumlah",
    cell: ({ row }) => {
      return row.original.qty;
    },
  },
  {
    accessorKey: "modal",
    header: "Modal",
    cell: ({ row }) => {
      return row.original.modal || "-";
    },
  },
  {
    accessorKey: "income",
    header: "Income",
    cell: ({ row }) => {
      return row.original.type === "income" ? formatCurrency(parseInt(row.original.value)) : "-";
    },
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: ({ row }) => {
      return row.original.type === "outcome" ? <span className="whitespace-nowrap">{formatCurrency(parseInt(row.original.value))}</span> : "-";
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      return row.original.remarks;
    },
  },
];
