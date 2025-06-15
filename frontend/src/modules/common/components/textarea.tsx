import { cn } from "../common-utils";

interface TextareaProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export const Textarea = ({
  label,
  placeholder,
  onChange,
  value,
  className,
}: TextareaProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-lg font-medium text-black">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 mt-4 border border-[#5C5C5C] rounded-sm text-black placeholder:text-[#C2C2C2]"
      />
    </div>
  );
};
