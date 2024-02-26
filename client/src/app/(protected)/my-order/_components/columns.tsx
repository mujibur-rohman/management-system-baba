"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import { json } from "stream/consumers";

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
        return accumulator + currentValue.qty;
      }, 0);

      return totalQty;
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
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       return <ActionCellProduct id={row.original.id} cart={row.original.cart} />;
  //     },
  //   },
];
