import React, { FC, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";

import ButtonBase from "@mui/material/ButtonBase";

import { cn } from "@/utils/helpers";

const variants = cva(
  "group overflow-hidden rounded-100 text-sm font-medium ring-blue-500 transition-all focus-visible:ring-2 disabled:bg-grey-700-12 disabled:text-grey-700-34",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white",
        secondary: "bg-blue-50 text-blue-500 hover:bg-blue-70",
        transparent: " text-blue-500 hover:bg-blue-70"
      }
    },
    defaultVariants: {
      variant: "secondary"
    }
  }
);

const insideVariants = cva("flex px-6 py-[10px] transition-all", {
  variants: {
    variant: {
      primary: "",
      secondary: "bg-blue-500-8 group-active:bg-blue-500-12",
      transparent: ""
    }
  },
  defaultVariants: {
    variant: "secondary"
  }
});

interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

const Button: FC<ButtonProps> = forwardRef(
  (
    { children, onClick, type, variant, className, disabled, ...props },
    ref
  ) => {
    return (
      <ButtonBase
        {...props}
        ref={ref}
        disabled={disabled}
        type={type ? type : "button"}
        onClick={onClick}
        className={cn(variants({ variant, className }))}
      >
        <span className={cn(insideVariants({ variant }))}>{children}</span>
      </ButtonBase>
    );
  }
);

export default Button;
