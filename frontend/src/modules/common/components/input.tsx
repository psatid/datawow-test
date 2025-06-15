import { cn } from "../common-utils";

interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = ({
  label,
  placeholder,
  onChange,
  value,
  className,
}: InputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-lg font-medium text-black">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#5C5C5C] rounded-sm text-black placeholder:text-[#C2C2C2]"
      />
    </div>
  );
};
