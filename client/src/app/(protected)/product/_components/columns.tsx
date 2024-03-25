"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import ActionCellProduct from "./action-cell";

export const columns: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "aromaBaru",
    header: "Aroma Baru",
    cell: ({ row }) => {
      return row.original.aromaBaru;
    },
  },
  {
    accessorKey: "aromaLama",
    header: "Aroma Lama",
    cell: ({ row }) => {
      return row.original.aromaLama;
    },
  },
  {
    accessorKey: "stock",
    header: "Stok",
    cell: ({ row }) => {
      return row.original.stock;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionCellProduct id={row.original.id} stock={row.original.stock} />;
    },
  },
];
