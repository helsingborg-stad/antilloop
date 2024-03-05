import { FC } from "react";
import { useTranslation } from "react-i18next";
import { VariantProps, cva } from "class-variance-authority";

import BinIcon from "./BinIcon";
import IconButton from "@/components/IconButton";

import { cn } from "@/utils/helpers";

interface FoodWasteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  toggleInfoModal?: () => void;
  settings: {
    date: string;
    currentLevel: number | null;
    numberOfStudents: number | null;
    yRange: { good: number; medium: number; bad: number };
    meatballs: number | null;
    gramPerStudent: number | null;
    timeAgo: string;
    variant: string;
    note: string;
    binIcon: number;
  };
}

const variants = cva("flex gap-4 rounded-32 bg-food-current", {
  variants: {
    variant: {
      quickLink: "p-6 h-full items-center",
      default:
        "relative flex-grow min-h-[128px] p-6 pb-16 sm:pb-4 sm:basis-1/2 md:pb-16 md:basis-auto 2xl:w-[328px]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const FoodWaste: FC<FoodWasteProps> = ({
  settings,
  variant = "default",
  toggleInfoModal
}) => {
  const quickLink = variant === "quickLink";

  const [t] = useTranslation();

  return (
    <div className={cn(variants({ variant }))}>
      <BinIcon className="shrink-0" fillHeight={settings.binIcon} />
      <div className="flex flex-col text-white">
        {!quickLink && (
          <IconButton
            className="absolute right-4 top-4"
            icon="info-round"
            onClick={toggleInfoModal}
            a11y={t("a11y.buttons.food_waste_info")}
            iconFill="fill-white group-hover:fill-white"
          />
        )}
        <p
          className={
            quickLink
              ? "text-lg font-medium"
              : "pr-8 text-lg font-medium leading-6"
          }
        >
          {t("food_waste.waste", { time: quickLink ? "" : settings.timeAgo })}
        </p>
        {settings.currentLevel && (
          <>
            <p
              className={
                quickLink
                  ? "text-lg font-medium"
                  : "text-[22px] font-medium transition-all"
              }
            >
              <span
                className={
                  quickLink
                    ? "mr-0.5 text-[32px] font-semibold leading-[40px]"
                    : "mr-0.5 text-4xl leading-[44px]"
                }
              >
                {settings.currentLevel}
              </span>
              {t("food_waste.kg")}
            </p>
            {!quickLink && <p className="text-sm">{settings.note}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodWaste;
