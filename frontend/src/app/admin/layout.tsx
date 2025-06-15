"use client";

import { Sidebar, TSidebarItem } from "@/modules/common/components";
import { History, Home, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const SIDEBAR_ITEMS: TSidebarItem[] = [
    {
      label: "Home",
      Icon: Home,
      href: "/admin/home",
    },
    {
      label: "History",
      Icon: History,
      href: "/admin/history",
    },
    {
      label: "Switch to user",
      Icon: User,
      onClick: () => {
        const email = prompt("Enter your email to switch to user mode:");
        localStorage.setItem("userEmail", email || "");
        router.push("/user");
      },
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar title="Admin" sidebarItems={SIDEBAR_ITEMS} />

      <div className="flex-1 bg-gray-100">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
