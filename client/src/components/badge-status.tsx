import { STATUS_MEMBER } from "@/services/auth/auth.types";
import React from "react";
import { Badge } from "./ui/badge";

function BadgeStatus({ role }: { role: keyof typeof STATUS_MEMBER }) {
  switch (role) {
    case "SUPPLIER":
      return (
        <Badge className="text-xs" variant="indigo">
          {role}
        </Badge>
      );
    case "DISTRIBUTOR":
      return (
        <Badge className="text-xs" variant="success">
          {role}
        </Badge>
      );
    case "RESELLER-UP":
      return (
        <Badge className="text-xs" variant="warning">
          {role}
        </Badge>
      );
    case "RESELLER-NC":
      return (
        <Badge className="text-xs" variant="secondary">
          {role}
        </Badge>
      );
    case "RESELLER":
      return (
        <Badge className="text-xs" variant="info">
          {role}
        </Badge>
      );
    default:
      return (
        <Badge className="text-xs" variant="default">
          {role}
        </Badge>
      );
  }
}

export default BadgeStatus;
