import { FC } from "react";

interface ChipProps {
  variant: string;
  label: string;
  onActiveSurface?: boolean;
}

const Chip: FC<ChipProps> = ({ variant, label, onActiveSurface }) => {
  return (
    <span
      className={`inline-block rounded-32 px-3 py-[6px] text-sm font-medium ${
        variant === "active"
          ? onActiveSurface
            ? "bg-lime-900-12"
            : "bg-lime-300 "
          : variant === "inactive"
          ? "h-8 border border-grey-300 bg-white text-grey-400"
          : ""
      }`}
    >
      {label}
    </span>
  );
};

export default Chip;
