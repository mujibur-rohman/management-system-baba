"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import formatCurrency from "@/lib/format-currency";
import ActionCellClosing from "./action-cell";

export const columns: ColumnDef<ClosingType>[] = [
  {
    accessorKey: "noOrder",
    header: "Nomor Closing",
    cell: ({ row }) => {
      return row.original.noOrder;
    },
  },
  {
    accessorKey: "aroma",
    header: "Aroma",
    cell: ({ row }) => {
      return `${row.original.product.aromaLama} / ${row.original.product.aromaBaru}`;
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      return moment(row.original.orderDate).format("LL");
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
    accessorKey: "name",
    header: "Nama Customer",
    cell: ({ row }) => {
      return row.original.customerName;
    },
  },
  {
    accessorKey: "jumlahOrder",
    header: "Jumlah Order",
    cell: ({ row }) => {
      return row.original.qty;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Harga",
    cell: ({ row }) => {
      return formatCurrency(parseInt(row.original.totalPrice));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.original.isConfirm)
        return (
          <Badge variant="success" className="whitespace-nowrap">
            Dikonfirmasi
          </Badge>
        );
      return <ActionCellClosing closingData={row.original} />;
    },
  },
];
