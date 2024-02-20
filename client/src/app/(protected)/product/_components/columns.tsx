"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";

export const columns: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "aroma",
    header: "Aroma",
    cell: ({ row }) => {
      return row.original.aroma;
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
      return (
        <Button variant="warning" size="sm">
          Perbarui
        </Button>
      );
    },
  },
];
