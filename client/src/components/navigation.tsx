"use client";

import {
  ArchiveRestoreIcon,
  ArrowLeftRightIcon,
  BanknoteIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HomeIcon,
  MoreHorizontalIcon,
  Package2Icon,
  PackageIcon,
  ShoppingCartIcon,
  User2Icon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { STATUS_MEMBER } from "@/services/auth/auth.types";

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
        href="/order"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/order",
        })}
      >
        <ShoppingCartIcon />
        <span className="text-xs">Order</span>
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
  const auth = useAuth();
  return (
    <div className="grid grid-cols-4 gap-3 py-2 m-3">
      {auth?.user?.role !== STATUS_MEMBER["RESELLER-NC"] && (
        <Link
          href="/member"
          className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
            "bg-blue-500 text-white": pathname === "/member",
          })}
        >
          <User2Icon className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-[10px] md:text-xs">Member</span>
        </Link>
      )}

      <Link href="/order-team" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <ArchiveRestoreIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs whitespace-nowrap">Orderan Tim</span>
      </Link>
      <Link
        href="/my-order"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/my-order",
        })}
      >
        <PackageIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs whitespace-nowrap">Orderan Saya</span>
      </Link>
      <Link href="/profit" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <WalletIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs">Profit</span>
      </Link>
      <Link href="/switch" className="p-2 gap-1 rounded-lg flex flex-col justify-center items-center hover:bg-foreground/20">
        <ArrowLeftRightIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs whitespace-nowrap">Tukar Aroma</span>
      </Link>
      <Link
        href="/closing"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/closing",
        })}
      >
        <HandshakeIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs">Closingan</span>
      </Link>
      {/* <Link
        href="/jadwal"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/jadwal",
        })}
      >
        <Package2Icon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs">Jadwal</span>
      </Link> */}
      <Link
        href="/fee"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/fee",
        })}
      >
        <HandCoinsIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs">Fee</span>
      </Link>
      <Link
        href="/payment"
        className={cn("p-2 gap-1 rounded-lg transition-all flex flex-col justify-center items-center hover:bg-foreground/20", {
          "bg-blue-500 text-white": pathname === "/payment",
        })}
      >
        <BanknoteIcon className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-[10px] md:text-xs">Payment</span>
      </Link>
    </div>
  );
}

export default Navigation;
