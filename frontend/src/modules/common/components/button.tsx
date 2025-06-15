import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "py-3 flex flex items-center justify-center px-4 hover:cursor-pointer text-sm rounded-sm hover:opacity-90 space-x-2.5 disabled:opacity-50 disabled:pointer-event-none",
  {
    variants: {
      variant: {
        default: "text-white bg-[#E84E4E]",
        outline: "border border-[#C4C4C4]",
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
}

export const Button = ({
  children,
  onClick,
  className,
  variant,
  isLoading,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={buttonVariants({ variant, className })}
      disabled={isLoading || disabled}
    >
      {isLoading && <Loader2 className="animate-spin size-4" />}
      {children}
    </button>
  );
};
