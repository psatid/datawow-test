import { Button, Input, Textarea } from "@/modules/common/components";
import { Save } from "lucide-react";
import { useState } from "react";
import { useCreateConcert } from "../concert-hooks";

interface CreateConcertFormProps {
  onCreateSuccess: () => void;
}

export const CreateConcertForm = ({
  onCreateSuccess,
}: CreateConcertFormProps) => {
  const [concertName, setConcertName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createConcert, isPending: isCreatingConcert } =
    useCreateConcert({ onSuccess: onCreateSuccess });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!concertName || !totalSeats || !description) {
      alert("Please fill in all fields.");
      return;
    }

    createConcert({
      name: concertName,
      description,
      seats: parseInt(totalSeats),
    });
  };

  return (
    <div className="border border-border p-10 bg-white rounded-md">
      <p className="text-3xl font-semibold text-blue">Create</p>
      <div className="w-full my-4 bg-border h-[1px]" />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <Input
            value={concertName}
            onChange={(e) => setConcertName(e.target.value)}
            label="Concert name"
            placeholder="Please input concert name"
            className="flex-1"
          />
          <Input
            value={totalSeats}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setTotalSeats(numericValue);
            }}
            label="Total of seats"
            placeholder="Please input total of seats"
            className="flex-1"
          />
        </div>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
          placeholder="Please input concert description"
          className="w-full"
        />

        <Button
          type="submit"
          className="bg-[#1692EC] ml-auto"
          isLoading={isCreatingConcert}
        >
          <Save size={24} />
          Save
        </Button>
      </form>
    </div>
  );
};
