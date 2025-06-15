import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../common-utils";

const buttonVariants = cva(
  "py-3 flex flex items-center justify-center px-4 hover:cursor-pointer text-sm rounded-sm hover:opacity-90 gap-2 disabled:opacity-50 disabled:pointer-event-none",
  {
    variants: {
      variant: {
        default: "text-white bg-red",
        outline: "border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  onClick,
  className,
  variant,
  isLoading,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant, className }))}
      disabled={isLoading || disabled}
      type={type || "button"}
    >
      {isLoading && <Loader2 className="animate-spin size-4" />}
      {children}
    </button>
  );
};
