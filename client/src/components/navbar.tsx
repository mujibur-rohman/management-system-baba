"use client";

import React from "react";
import styles from "@/components/styles.module.scss";
import AppWrapper from "@/components/app-wrapper";
import { useTheme } from "next-themes";
import Link from "next/link";
import { LogOutIcon, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthService from "@/services/auth/auth.service";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const session = useAuth();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border backdrop-blur-sm">
      <AppWrapper>
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-primary font-bold text-xl">
            BABA
          </Link>
          <div className="flex gap-4 items-center">
            <input
              id="toggle"
              className={styles.toggle}
              type="checkbox"
              onChange={() => {
                toggleTheme();
              }}
            />
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={session?.user?.avatar?.url} alt="@shadcn" />
                  <AvatarFallback className="font-semiboldx">{session?.user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-52 overflow-hidden">
                  <Link href="/profile" className="px-2 hover:bg-foreground/25 py-3 flex items-center gap-2 border-b border-b-border text-xs">
                    <User2Icon className="text-foreground/60 w-6 h-6" />
                    <span>Profil Saya</span>
                  </Link>
                  <div
                    onClick={async () => {
                      const auth = new AuthService();
                      await auth.logout();
                      router.replace("/auth");
                    }}
                    className="hover:bg-foreground/25 cursor-pointer px-2 py-3 flex items-center gap-2 border-b border-b-border text-xs"
                  >
                    <LogOutIcon className="text-foreground/60 w-6 h-6" />
                    <span>Logout</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AppWrapper>
    </nav>
  );
}

export default Navbar;
