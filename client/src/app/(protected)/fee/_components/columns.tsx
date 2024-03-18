"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import moment from "moment";
import FeeTypes from "@/services/order/fee.types";

export const columns: ColumnDef<FeeTypes>[] = [
  {
    accessorKey: "noOrder",
    header: "Nomor Order",
    cell: ({ row }) => {
      return row.original.order.noOrder;
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      return moment(row.original.feeDate).format("LL");
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
      const jsonCart: Cart[] = JSON.parse(row.original.order.cartData);
      const totalQty = jsonCart.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.qty * 1;
      }, 0);
      return totalQty;
    },
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      return row.original.fee;
    },
  },
];
