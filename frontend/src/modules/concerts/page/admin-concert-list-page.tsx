"use client";

import { useState } from "react";
import {
  AdminConcertList,
  AdminConcertTabs,
  ConcertStats,
  CreateConcertForm,
} from "../components";

export const AdminConcertListPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "create">("overview");
  const handleTabChange = (tab: "overview" | "create") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <ConcertStats />
      <AdminConcertTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="mt-4">
        {activeTab === "overview" && <AdminConcertList />}
        {activeTab === "create" && (
          <CreateConcertForm onCreateSuccess={() => setActiveTab("overview")} />
        )}
      </div>
    </div>
  );
};
