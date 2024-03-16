"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import ActionCellMyOrder from "./action-cell";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

export const columns: ColumnDef<OrderTypes>[] = [
  {
    accessorKey: "noOrder",
    header: "Nomor Order",
    cell: ({ row }) => {
      return row.original.noOrder;
    },
  },
  {
    accessorKey: "tglOrder",
    header: "Tanggal Order",
    cell: ({ row }) => {
      return moment(row.original.orderDate).format("LL");
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
      return row.original.totalPrice;
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
    accessorKey: "bayarTf",
    header: "Transfer",
    cell: ({ row }) => {
      return row.original.amountTrf;
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
