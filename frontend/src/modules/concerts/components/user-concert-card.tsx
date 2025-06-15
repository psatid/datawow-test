import { Button } from "@/modules/common/components";
import { User } from "lucide-react";
import {
  useCancelConcertReservation,
  useReserveConcert,
} from "../concert-hooks";

interface UserConcertCardProps {
  concertId: string;
  concertName: string;
  description: string;
  availableSeats: number;
  isReserved: boolean;
}

export const UserConcertCard = ({
  concertId,
  concertName,
  description,
  availableSeats,
  isReserved,
}: UserConcertCardProps) => {
  const { mutate: reserveSeat, isPending: isReservingSeat } =
    useReserveConcert(concertId);
  const { mutate: cancelReservation, isPending: isCancellingReservation } =
    useCancelConcertReservation(concertId);

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-3xl font-semibold text-blue">{concertName}</h3>
        <div className="w-full h-[1px] bg-border mt-6" />

        <p className="text-black text-lg mt-6">{description}</p>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center text-gray-600">
            <User size={32} className="mr-2" />
            <span className="text-lg text-black">{availableSeats}</span>
          </div>
          {isReserved ? (
            <Button
              onClick={() => cancelReservation()}
              isLoading={isCancellingReservation}
            >
              <span>Cancel</span>
            </Button>
          ) : (
            <Button
              className="bg-blue"
              onClick={() => reserveSeat()}
              isLoading={isReservingSeat}
              disabled={availableSeats <= 0}
            >
              <span>Reserve</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
