import { FC } from "react";
import { VariantProps, cva } from "class-variance-authority";

import { ButtonBase } from "@mui/material";
import Icon from "./Icon";

import { cn } from "@/utils/helpers";

interface FilterButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  label: string;
}

const variants = cva(
  "gap-1 rounded-32 py-[6px] pl-4 pr-2 text-sm font-medium text-grey-400 ring-blue-500 focus-visible:ring-2 hover:bg-blue-500-8 active:bg-blue-500-12",
  {
    variants: {
      variant: {
        white: "bg-white",
        default: "bg-grey-100"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const FilterButton: FC<FilterButtonProps> = ({
  variant = "default",
  label,
  onClick
}) => {
  return (
    <ButtonBase
      className={cn(variants({ variant }))}
      onClick={onClick}
      disableRipple
    >
      {label}
      <Icon name="caret" />
    </ButtonBase>
  );
};

export default FilterButton;
