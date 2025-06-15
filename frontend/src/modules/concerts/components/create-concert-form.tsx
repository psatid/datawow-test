import { Button, Input, Textarea } from "@/modules/common/components";
import { Save } from "lucide-react";

export const CreateConcertForm = () => {
  return (
    <div className="border border-border p-10 bg-white rounded-md">
      <p className="text-3xl font-semibold text-blue">Create</p>
      <div className="w-full my-4 bg-border h-[1px]" />
      <form className="space-y-6">
        <div className="flex space-x-4">
          <Input
            label="Concert name"
            placeholder="Please input concert name"
            className="flex-1"
          />
          <Input
            label="Total of seats"
            placeholder="Please input total of seats"
            className="flex-1"
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Please input concert description"
          className="w-full"
        />

        <Button type="submit" className="bg-[#1692EC] ml-auto">
          <Save size={24} />
          Save
        </Button>
      </form>
    </div>
  );
};
