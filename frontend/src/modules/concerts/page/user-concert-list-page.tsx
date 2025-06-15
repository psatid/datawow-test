"use client";

import { UserConcertCard } from "../components/user-concert-card";
import { useGetUserConcertsList } from "../concert-hooks";

export const UserConcertListPage = () => {
  const { data: concerts } = useGetUserConcertsList();

  return concerts?.map((concert) => (
    <UserConcertCard
      key={concert.id}
      concertId={concert.id}
      concertName={concert.name}
      description={concert.description}
      availableSeats={concert.availableSeats}
      isReserved={concert.isReserved}
    />
  ));
};
