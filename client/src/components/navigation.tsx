"use client";

import { ArchiveRestoreIcon, HomeIcon, MoreHorizontalIcon, Package2Icon, PackageIcon, ShoppingCartIcon, User2Icon, WalletIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Navigation() {
  const pathname = usePathname();
  if (pathname === "/carts") return null;
  return (
    <div className="fixed grid grid-cols-4 gap-3 bottom-0 right-0 left-0 bg-background border-border border p-2 rounded-t-lg">
      <Link
        href="/"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/",
        })}
      >
        <HomeIcon />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link
        href="/product"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/product",
        })}
      >
        <Package2Icon />
        <span className="text-xs">Produk</span>
      </Link>
      <Link
        href="/member"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/member",
        })}
      >
        <User2Icon />
        <span className="text-xs">Member</span>
      </Link>
      <Drawer>
        <DrawerTrigger>
          <div className="cursor-pointer p-2 transition-all gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
            <MoreHorizontalIcon />
            <span className="text-xs">Lainnya</span>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <MenuItem pathname={pathname} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function MenuItem({ pathname }: { pathname: string }) {
  return (
    <div className="grid grid-cols-4 gap-3 py-2 m-3">
      <Link
        href="/order"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/order",
        })}
      >
        <ShoppingCartIcon />
        <span className="text-xs">Order</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <ArchiveRestoreIcon />
        <span className="text-xs">Orderan Tim</span>
      </Link>
      <Link
        href="/my-order"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/my-order",
        })}
      >
        <PackageIcon />
        <span className="text-xs">Orderan Saya</span>
      </Link>
      <Link href="/" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <WalletIcon />
        <span className="text-xs">Keuangan</span>
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
