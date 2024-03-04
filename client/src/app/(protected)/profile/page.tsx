"use client";
import AppWrapper from "@/components/app-wrapper";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import AvatarProfile from "./_component/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ChangeNameProfile from "./_component/change-name";
import UpdatePassword from "./_component/update-password";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import "moment/locale/id";

function ProfilePage() {
  const user = useAuth();
  const [modalName, setModalName] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  if (!user?.user) {
    return (
      <div className="flex flex-col items-center py-5">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="mt-3 space-y-1">
          <Skeleton className="h-4 w-[50px] mb-2" />
          <Skeleton className="h-4 w-[50px]" />
        </div>
        <div className="mt-5">
          <Skeleton className="h-10 w-[300px] mb-5" />
          <Skeleton className="h-16 w-[300px] mb-5" />
          <Skeleton className="h-24 w-[300px] mb-5" />
        </div>
      </div>
    );
  }

  return (
    <AppWrapper className="flex flex-col items-center py-5 pb-32">
      <AvatarProfile />
      <div className="mt-3 space-y-1 text-center">
        <p className="text-foreground/50 text-center">{user?.user?.name}</p>
        <Badge variant="success">{user?.user?.role.toUpperCase()}</Badge>
      </div>
      <div className=" mt-5">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold">Total Member</span>
          <span className="text-xl font-bold">103</span>
        </div>
      </div>
      <div className="p-3 border border-border mt-5 rounded flex flex-wrap gap-5 justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">Leader</span>
          <span>{user?.user?.parent?.name || "-"}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">ID Member</span>
          <span>{user?.user?.idMember}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">Tanggal Join</span>
          <span>{moment(user?.user?.joinDate).format("LL")}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <ChangeNameProfile defaultName={user?.user?.name} setOpen={setModalName} isOpen={modalName} />
        <UpdatePassword isOpen={modalPassword} setOpen={setModalPassword} />
      </div>
    </AppWrapper>
  );
}

export default ProfilePage;
