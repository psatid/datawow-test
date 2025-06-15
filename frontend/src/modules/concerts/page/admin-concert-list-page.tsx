"use client";

import { useState } from "react";
import {
  AdminConcertList,
  AdminConcertTabs,
  ConcertStats,
  CreateConcertForm,
} from "../components";
import { ConcertInfo } from "../concert-types";

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
        {activeTab === "overview" && (
          <AdminConcertList concerts={mockConcerts} />
        )}
        {activeTab === "create" && <CreateConcertForm />}
      </div>
    </div>
  );
};

const mockConcerts: ConcertInfo[] = [
  {
    id: "1",
    name: "Concert A",
    description: "Description for Concert A",
    seats: 100,
  },
  {
    id: "2",
    name: "Concert B",
    description: "Description for Concert B",
    seats: 200,
  },
  {
    id: "3",
    name: "Concert C",
    description: "Description for Concert C",
    seats: 150,
  },
];
