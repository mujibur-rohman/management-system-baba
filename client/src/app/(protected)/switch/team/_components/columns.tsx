"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon } from "lucide-react";
import "moment/locale/id";
import ActionCellSwitch from "../../me/_components/action-cell";
import { SwitchType } from "@/services/product/switch.types";

export const columns: ColumnDef<SwitchType>[] = [
  {
    accessorKey: "name",
    header: "Nama Member",
    cell: ({ row }) => {
      return row.original.user.name;
    },
  },
  {
    accessorKey: "old",
    header: "From",
    cell: ({ row }) => {
      return row.original.oldNameProd;
    },
  },
  {
    accessorKey: "label",
    header: "",
    cell: ({ row }) => {
      return <ArrowRightIcon />;
    },
  },
  {
    accessorKey: "new",
    header: "To",
    cell: ({ row }) => {
      return row.original.newNameProd;
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.original.isConfirm)
        return (
          <Badge variant="success" className="whitespace-nowrap">
            Dikonfirmasi
          </Badge>
        );
      return <ActionCellSwitch switchData={row.original} memberId={row.original.userId} />;
    },
  },
];
