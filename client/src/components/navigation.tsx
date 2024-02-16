"use client";

import { HomeIcon, MoreHorizontalIcon, Package2Icon, User2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

function Navigation() {
  return (
    <div className="fixed grid grid-cols-4 bottom-0 right-0 left-0 bg-background border-border border p-2 rounded-t-lg">
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <HomeIcon />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/product" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <Package2Icon />
        <span className="text-xs">Produk</span>
      </Link>
      <Link href="/member" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
      <Drawer>
        <DrawerTrigger>
          <div className="cursor-pointer p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
            <MoreHorizontalIcon />
            <span className="text-xs">Lainnya</span>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <MenuItem />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="grid grid-cols-4 py-5">
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <HomeIcon />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <Package2Icon />
        <span className="text-xs">Produk</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <HomeIcon />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <Package2Icon />
        <span className="text-xs">Produk</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
    </div>
  );
}

export default Navigation;
