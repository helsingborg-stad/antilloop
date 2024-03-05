import { FC } from "react";
import { VariantProps, cva } from "class-variance-authority";

import ButtonBase from "@mui/material/ButtonBase";

import Icon from "@/components/Icon";

import { cn } from "@/utils/helpers";

interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  icon: string;
  disabled?: boolean;
  iconFill?: string;
  className?: string;
  a11y: string;
}

const variants = cva(
  "group overflow-hidden rounded-100 ring-blue-500 transition-all focus-visible:ring-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        white: "bg-white shadow-material-s",
        grey: "bg-grey-100 hover:bg-blue-500-8 focused:bg-blue-500-12 active:bg-blue-500-16",
        greyTransparent:
          "bg-grey-700-8 hover:bg-blue-500-8 focused:bg-blue-500-12 active:bg-blue-500-16",
        default:
          "hover:bg-blue-500-8 focused:bg-blue-500-12 active:bg-blue-500-16"
      },
      size: {
        large: "p-3",
        small: "p-1",
        default: "p-2"
      }
    },
    compoundVariants: [{ variant: "default", size: "default" }],
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const IconButton: FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled,
  className,
  a11y,
  iconFill,
  variant,
  size,
  ...props
}) => {
  const appearenceIcon = disabled ? "fill-grey-400 opacity-50" : "";

  return (
    <ButtonBase
      {...props}
      onClick={onClick}
      className={cn(variants({ variant, size, className }))}
      aria-label={a11y}
      type="button"
    >
      <Icon
        className={`transition-all group-hover:fill-blue-500 ${appearenceIcon} ${
          iconFill ? iconFill : ""
        }`}
        name={icon}
      />
    </ButtonBase>
  );
};

export default IconButton;
