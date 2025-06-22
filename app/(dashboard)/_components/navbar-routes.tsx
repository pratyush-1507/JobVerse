"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");

  return (
    <div className="flex items-center gap-x-2 ml-auto">
      {isAdminPage || isPlayerPage ? (
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-700/20 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </Link>
      ) : (
        <Link href="/admin/jobs">
          <Button variant="outline" size="sm" className="border-purple-700/20">
            Admin
          </Button>
        </Link>
      )}

      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
