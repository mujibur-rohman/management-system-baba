"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import { json } from "stream/consumers";
import ActionCellMyOrder from "./action-cell";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<OrderTypes>[] = [
  {
    accessorKey: "noOrder",
    header: "Nomor Order",
    cell: ({ row }) => {
      return row.original.noOrder;
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
      console.log(totalQty);
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
      return row.original.totalPrice;
    },
  },
  {
    accessorKey: "bayarTf",
    header: "Transfer",
    cell: ({ row }) => {
      return row.original.amountTrf;
    },
  },
  {
    accessorKey: "bayarCash",
    header: "Cash",
    cell: ({ row }) => {
      return row.original.amountCash;
    },
  },
  {
    accessorKey: "remainingAmount",
    header: "Hutang",
    cell: ({ row }) => {
      return row.original.remainingAmount;
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
