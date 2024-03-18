import BadgeStatus from "@/components/badge-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationInterface } from "@/interface/pagination";
import { cn } from "@/lib/utils";
import { STATUS_MEMBER } from "@/services/auth/auth.types";
import MemberTypesProfile from "@/services/member/member.type";
import React from "react";

function Hierarchy({ members }: { members: PaginationInterface<MemberTypesProfile> | undefined }) {
  return (
    <div className="flex flex-col gap-2">
      {members?.data.map((member) => (
        <MemberView key={member.id} members={member} isChild={false} depth={0} />
      ))}
    </div>
  );
}

function MemberView({ members, isChild, depth }: { members: MemberTypesProfile; isChild: boolean; depth: number }) {
  const { id, avatar, name, children, role } = members;

  return (
    <div key={id}>
      <div className="relative overflow-hidden flex items-center gap-2 border border-border pl-4 p-2 rounded">
        <div
          className={cn("absolute w-1 top-0 bottom-0 left-0", {
            "bg-indigo-500": isChild && depth % 2 === 0,
            "bg-indigo-400": !isChild,
            "bg-orange-500": isChild && depth % 2 !== 0,
            // "bg-indigo-500": !isChild && depth % 2 !== 0,
          })}
        />
        <Avatar>
          <AvatarImage src={avatar?.url} alt="@shadcn" />
          <AvatarFallback className="text-xl">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-xs">
          <span className="capitalize font-medium">{name}</span>
          <div className="self-start">
            <BadgeStatus role={role.toUpperCase() as keyof typeof STATUS_MEMBER} />
          </div>
        </div>
      </div>

      {children && (
        <div className="ml-10 mt-1 flex flex-col gap-1">
          {children.map((child) => (
            <MemberView key={child.id} members={child} isChild depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hierarchy;
