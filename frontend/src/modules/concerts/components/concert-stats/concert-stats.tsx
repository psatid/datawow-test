import { Award, User, XCircle } from "lucide-react";
import { ConcertStatCard } from "./concert-stat-card";

export const ConcertStats = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <ConcertStatCard
        variant="info"
        Icon={User}
        label="Total of seats"
        value={500}
      />
      <ConcertStatCard
        variant="success"
        Icon={Award}
        label="Reserve"
        value={120}
      />
      <ConcertStatCard
        variant="error"
        Icon={XCircle}
        label="Cance;"
        value={134}
      />
    </div>
  );
};
