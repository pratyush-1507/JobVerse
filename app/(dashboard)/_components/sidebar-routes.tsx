"use client"
import React from 'react'
import{Bookmark, Compass, Home, List, Search, User} from 'lucide-react'
import { useRouter, usePathname } from "next/navigation";
import { SidebarRouteItem } from './sidebar-route-item';


const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  },
];
const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Search,
    label: "Search Jobs",
    href: "/search",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user",
  },
  {
    icon: Bookmark,
    label: "Bookmarks",
    href: "/savedJobs",
  },
];
export const SidebarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isAdminPage = pathname?.startsWith("/admin");
    const routes = isAdminPage ? adminRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full gap-y-2 overflow-y-auto">
      {routes.map((route) => (
        <SidebarRouteItem
          key={route.href} icon={route.icon}
          label={route.label}
            href={route.href}
        />
      ))}
    </div>
  );
  
}
