import { cva, type VariantProps } from "class-variance-authority";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const concertStatCardVariant = cva(
  "py-6 rounded-lg text-white space-y-2.5 flex flex-col justify-center items-center",
  {
    variants: {
      variant: {
        info: "bg-[#0070A4] ",
        success: "bg-[#00A58B]",
        error: "bg-[#F96464]",
      },
    },
  }
);

interface ConcertStatCardProps
  extends VariantProps<typeof concertStatCardVariant> {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: number;
}

export const ConcertStatCard = ({
  Icon,
  label,
  value,
  variant,
}: ConcertStatCardProps) => {
  return (
    <div className={concertStatCardVariant({ variant })}>
      <Icon size={40} />
      <p className="text-2xl text-white">{label}</p>
      <p className="text-6xl text-white">{value}</p>
    </div>
  );
};
