import { Trash2, User } from "lucide-react";

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
  return (
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
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 ml-6">
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
