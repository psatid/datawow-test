import { cn } from "@/modules/common/common-utils";

interface AdminConcertTabsProps {
  activeTab: "overview" | "create";
  onTabChange: (tab: "overview" | "create") => void;
}

export const AdminConcertTabs = ({
  activeTab,
  onTabChange,
}: AdminConcertTabsProps) => {
  return (
    <div className="flex">
      <TabButton
        isActive={activeTab === "overview"}
        label="Overview"
        onClick={() => onTabChange("overview")}
      />
      <TabButton
        isActive={activeTab === "create"}
        label="Create"
        onClick={() => onTabChange("create")}
      />
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

const TabButton = ({ isActive, label, onClick }: TabButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer",
        isActive && "text-blue-500 border-b-2 border-blue-500 font-medium"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
