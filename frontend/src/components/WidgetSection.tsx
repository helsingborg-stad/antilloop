import { FC } from "react";
import { VariantProps, cva } from "class-variance-authority";

import Food from "@/assets/img/sections/food.png";
import Plant from "@/assets/img/sections/plant.png";
import Air from "@/assets/img/sections/air.png";
import Electricity from "@/assets/img/sections/electricity.png";

import { cn } from "@/utils/helpers";

interface WidgetSectionProps extends VariantProps<typeof variants> {
  title?: string;
  children: React.ReactNode;
}

const variants = cva("w-full px-4 relative z-10 overflow-hidden xl:px-0", {
  variants: {
    variant: {
      food_tracker: "bg-lime-50",
      environmental_monitor: "bg-blue-150",
      plant_care: "bg-lime-150",
      electricity_meter: "bg-blue-300",
      default: ""
    },
    layout: {
      section:
        "pt-8 pb-8 md:pt-12 md:pb-12 lg:pt-[120px] lg:pb-[120px] 2xl:pt-[160px] 2xl:pb-[160px]",
      standalone: "",
      default: "pt-14 pb-8 md:pb-12 lg:pb-[120px] 2xl:pb-[160px]"
    }
  },
  compoundVariants: [
    {
      variant: "default",
      layout: "default"
    }
  ],
  defaultVariants: {
    variant: "default",
    layout: "default"
  }
});

const WidgetSection: FC<WidgetSectionProps> = ({
  title,
  variant,
  layout,
  children
}) => {
  return (
    <section className={cn(variants({ variant, layout }))}>
      <div className="mx-auto xl:min-w-[960px] xl:px-[120px] 2xl:min-w-[1360px]">
        {title ? (
          <h1
            className={`mb-8 text-center text-[32px] font-bold leading-[40px] sm:text-[48px] sm:leading-[56px] md:text-[64px] md:leading-[72px] ${
              variant === "electricity_meter" ? "text-white" : ""
            }`}
          >
            {title}
          </h1>
        ) : null}
        {variant === "food_tracker" ? (
          <div className="absolute -right-[453px] top-[66px] -z-10 h-[1000px] w-[1000px] transition-all">
            <img
              className="pointer-events-none h-full w-full"
              src={Food}
              loading="lazy"
              alt=""
            />
          </div>
        ) : variant === "plant_care" ? (
          <div className="absolute -top-[10%] right-[30%] -z-10 h-[1000px] w-[1000px] transition-all">
            <img
              className="pointer-events-none h-full w-full"
              src={Plant}
              loading="lazy"
              alt=""
            />
          </div>
        ) : variant === "environmental_monitor" ? (
          <div className="absolute -top-10 left-[60%] -z-10 h-[870px] w-[870px] -translate-x-1/2 transition-all lg:top-[60px]">
            <img
              className="pointer-events-none h-full w-full"
              src={Air}
              loading="lazy"
              alt=""
            />
          </div>
        ) : variant === "electricity_meter" ? (
          <div className="absolute -top-[55px] left-[55%] -z-10 h-[720px] w-[960px] -translate-x-1/2 transition-all lg:top-0">
            <img
              className="pointer-events-none h-full w-full"
              src={Electricity}
              loading="lazy"
              alt=""
            />
          </div>
        ) : null}
        <div className="space-y-8">{children}</div>
      </div>
    </section>
  );
};

export default WidgetSection;
