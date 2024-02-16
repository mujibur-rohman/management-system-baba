import { STATUS_MEMBER } from "@/services/auth/auth.types";
import React from "react";
import { Badge } from "./ui/badge";

function BadgeStatus({ role }: { role: keyof typeof STATUS_MEMBER }) {
  switch (role) {
    case "SUPPLIER":
      return <Badge variant="warning">{role}</Badge>;
    case "DISTRIBUTOR":
      return <Badge variant="success">{role}</Badge>;
    case "RESELLER":
      return <Badge variant="info">{role}</Badge>;
    default:
      return <Badge variant="default">{role}</Badge>;
  }
}

export default BadgeStatus;
