"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import ActionCellMyOrder from "./action-cell";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import formatCurrency from "@/lib/format-currency";

export const columns: ColumnDef<OrderTypes>[] = [
  {
    accessorKey: "noOrder",
    header: "Nomor Order",
    cell: ({ row }) => {
      return row.original.noOrder;
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{moment(row.original.orderDate).format("LL")}</span>;
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
    accessorKey: "jumlahOrder",
    header: "Jumlah Order",
    cell: ({ row }) => {
      const jsonCart: Cart[] = JSON.parse(row.original.cartData);
      const totalQty = jsonCart.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.qty * 1;
      }, 0);
      return totalQty;
    },
  },
  {
    accessorKey: "status",
    header: "Dikonfirmasi",
    cell: ({ row }) => {
      return <Badge variant={row.original.isConfirm ? "success" : "destructive"}>{row.original.isConfirm ? "Ya" : "Belum"}</Badge>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Wajib Bayar",
    cell: ({ row }) => {
      return formatCurrency(parseInt(row.original.totalPrice));
    },
  },
  {
    accessorKey: "bayarCash",
    header: "Cash",
    cell: ({ row }) => {
      return formatCurrency(parseInt(row.original.amountCash));
    },
  },
  {
    accessorKey: "bayarTf",
    header: "Transfer",
    cell: ({ row }) => {
      return formatCurrency(parseInt(row.original.amountTrf));
    },
  },
  {
    accessorKey: "remainingAmount",
    header: "Hutang",
    cell: ({ row }) => {
      return formatCurrency(parseInt(row.original.remainingAmount));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionCellMyOrder order={row.original} />;
    },
  },
];
