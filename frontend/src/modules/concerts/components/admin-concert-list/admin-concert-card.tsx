import { Button, Modal } from "@/modules/common/components";
import { Trash2, User, X } from "lucide-react";
import { useState } from "react";

interface AdminConcertCardProps {
  concertName: string;
  description: string;
  seats: number;
  onDelete: () => void;
}

export const AdminConcertCard = ({
  concertName,
  description,
  seats,
}: //   onDelete,
AdminConcertCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-[#C2C2C2]">
        <h3 className="text-3xl font-semibold text-[#1692EC]">{concertName}</h3>
        <div className="w-full h-[1px] bg-[#C2C2C2] mt-6" />

        <p className="text-black text-lg mt-6">{description}</p>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center text-gray-600">
            <User size={32} className="mr-2" />
            <span className="text-lg text-black">{seats}</span>
          </div>
          <Button
            className="bg-[#E84E4E]"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={24} />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        header={
          <div className="space-y-6 flex flex-col items-center text-center">
            <div className="bg-red-500 p-3 rounded-full">
              <X size={24} className="text-white" />
            </div>
            <p className="text-black font-bold">
              Are you sure to delete <br />”{concertName}”?
            </p>
          </div>
        }
        footer={
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setIsDeleteModalOpen(false);
              }}
            >
              Yes, Delete
            </Button>
          </div>
        }
      />
    </>
  );
};
