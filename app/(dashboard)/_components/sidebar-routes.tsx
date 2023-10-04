"use client";

import { Layout, Compass, List, BarChart3 } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Overview",
    href: "/teacher/courses",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = () => {

  const pathname = usePathname();
  const isTeacherPage = pathname.includes("/teacher");


  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
