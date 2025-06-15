import { useGetConcerts } from "../../concert-hooks";
import { AdminConcertCard } from "./admin-concert-card";

export const AdminConcertList = () => {
  const { data } = useGetConcerts();
  return (
    <div className="space-y-12">
      {(data?.concerts ?? []).map((concert) => (
        <AdminConcertCard
          key={concert.id}
          concertId={concert.id}
          concertName={concert.name}
          description={concert.description}
          seats={concert.seats}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
};
