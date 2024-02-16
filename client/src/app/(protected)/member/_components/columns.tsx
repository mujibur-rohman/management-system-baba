"use client";

import BadgeStatus from "@/components/badge-status";
import { STATUS_MEMBER } from "@/services/auth/auth.types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import "moment/locale/id";
import ActionCell from "./action-cell";

export const columns: ColumnDef<MemberTypesProfile>[] = [
  {
    accessorKey: "idMember",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Status",
    cell: ({ row }) => {
      return <BadgeStatus role={row.original.role.toUpperCase() as keyof typeof STATUS_MEMBER} />;
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join",
    cell: ({ row }) => {
      return <span className="whitespace-nowrap">{moment(row.original.joinDate).format("LL")}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionCell id={row.original.id.toString()} />;
    },
  },
];
