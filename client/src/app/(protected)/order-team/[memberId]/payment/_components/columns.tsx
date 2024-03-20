"use client";

import { ColumnDef } from "@tanstack/react-table";
import "moment/locale/id";
import moment from "moment";
import PaymentType from "@/services/order/payment.types";
import formatCurrency from "@/lib/format-currency";
import { Badge } from "@/components/ui/badge";
import ActionCellPayment from "./action-cell";

export const columns: ColumnDef<PaymentType>[] = [
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
      return <span className="whitespace-nowrap">{moment(row.original.paymentDate).format("LL")}</span>;
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
    accessorKey: "bayarCash",
    header: "Cash",
    cell: ({ row }) => {
      return row.original.amountCash ? formatCurrency(parseInt(row.original.amountCash)) : "-";
    },
  },
  {
    accessorKey: "bayarTf",
    header: "Transfer",
    cell: ({ row }) => {
      return row.original.amountTrf ? formatCurrency(parseInt(row.original.amountTrf)) : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Dikonfirmasi",
    cell: ({ row }) => {
      if (row.original.isConfirm) return <Badge variant="success">Ya</Badge>;
      return <ActionCellPayment payment={row.original} />;
    },
  },
];
