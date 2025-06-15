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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-blue-500 mb-4">
              {concertName}
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
            <div className="flex items-center text-gray-600">
              <User size={16} className="mr-2" />
              <span>{seats}</span>
            </div>
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
