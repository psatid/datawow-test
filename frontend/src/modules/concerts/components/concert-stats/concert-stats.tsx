import { Award, User, XCircle } from "lucide-react";
import { ConcertStatCard } from "./concert-stat-card";
import { useGetConcerts } from "../../concert-hooks";

export const ConcertStats = () => {
  const { data } = useGetConcerts();

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <ConcertStatCard
        variant="info"
        Icon={User}
        label="Total of seats"
        value={data?.totalSeats || 0}
      />
      <ConcertStatCard
        variant="success"
        Icon={Award}
        label="Reserve"
        value={data?.totalConfirmedReservations || 0}
      />
      <ConcertStatCard
        variant="error"
        Icon={XCircle}
        label="Cancel"
        value={data?.totalCancelledReservations || 0}
      />
    </div>
  );
};
