import { ConcertInfo } from "../../concert-types";
import { AdminConcertCard } from "./admin-concert-card";

interface AdminConcertListProps {
  concerts: ConcertInfo[];
}

export const AdminConcertList = ({ concerts }: AdminConcertListProps) => {
  return (
    <div className="space-y-12">
      {concerts.map((concert) => (
        <AdminConcertCard
          key={concert.id}
          concertName={concert.name}
          description={concert.description}
          seats={concert.seats}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
};
