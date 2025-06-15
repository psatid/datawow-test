import { Sidebar, TSidebarItem } from "@/modules/common/components";
import { RefreshCcw } from "lucide-react";

const SIDEBAR_ITEMS: TSidebarItem[] = [
  {
    label: "Switch to admin",
    Icon: RefreshCcw,
    href: "/admin/home",
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
