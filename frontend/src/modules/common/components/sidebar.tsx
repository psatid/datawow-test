import { LogOut, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type TSidebarItem = {
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  href: string;
};

interface SidebarProps {
  title: string;
  sidebarItems: TSidebarItem[];
}

export const Sidebar = ({ title, sidebarItems }: SidebarProps) => {
  return (
    <div className="w-60 py-10 bg-white text-black border-r border-[#E7E7E7] sticky top-0 h-screen">
      <div className="p-6">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      <div className="flex flex-col justify-between px-2">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        <SidebarItem Icon={LogOut} label="Logout" href="/logout" />
      </div>
    </div>
  );
};

export const SidebarItem = ({ Icon, label }: TSidebarItem) => {
  return (
    <div className="flex items-center space-x-3 py-4 px-2 hover:bg-[#EAF5F9] rounded-lg cursor-pointer">
      <Icon size={24} />
      <span>{label}</span>
    </div>
  );
};
