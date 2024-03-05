import { FC } from "react";
import { useTranslation } from "react-i18next";
import { VariantProps, cva } from "class-variance-authority";

import PlantIcon from "./PlantIcon";
import IconButton from "@/components/IconButton";

import { cn } from "@/utils/helpers";

interface PlantMoistureProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  toggleInfoModal?: () => void;
  settings: {
    currentLevel: number | null;
    bgColor: string;
    level: string;
    note: string;
    iconVariant: string;
  };
}

const variants = cva("flex items-center p-6 rounded-32", {
  variants: {
    variant: {
      quickLink: "h-full",
      default:
        "relative flex-1 pb-20 pl-2 sm:p-10 sm:pb-20 2xl:basis-[calc(50%-8px)] 2xl:p-12 2xl:pl-6"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const PlantMoisture: FC<PlantMoistureProps> = ({
  settings,
  toggleInfoModal,
  variant = "default"
}) => {
  const quickLink = variant === "quickLink";

  const [t] = useTranslation();

  return (
    <div
      className={cn(
        variants({ variant }),
        settings.bgColor,
        quickLink ? "quick-link" : ""
      )}
    >
      <div
        className={`shrink-0 ${
          quickLink ? "mr-4 pl-[13px] pr-[14px]" : "pl-[26px] pr-[28px]"
        }`}
      >
        <PlantIcon
          iconVariant={settings.iconVariant}
          fillHeight={settings.currentLevel}
          className={quickLink ? "h-[64px] w-[37px]" : ""}
        />
      </div>
      {!quickLink && (
        <IconButton
          className="absolute right-4 top-4"
          icon="info-round"
          onClick={toggleInfoModal}
          a11y={t("a11y.buttons.soil_moisture_info")}
          iconFill="fill-white group-hover:fill-white"
        />
      )}
      <div className="text-white">
        <h5
          className={
            quickLink ? "text-lg font-medium" : "mb-2 text-2xl font-bold"
          }
        >
          Plant
        </h5>
        <p
          className={
            quickLink ? "text-lg font-medium" : "text-[22px] font-medium"
          }
        >
          {(settings.currentLevel || settings.currentLevel === 0) && (
            <>
              <span
                className={
                  quickLink
                    ? "text-[32px] font-semibold leading-[40px]"
                    : "mr-0.5 text-[44px] font-semibold leading-[56px]"
                }
              >
                {settings.currentLevel}
              </span>
              {t("plant_moisture.unit")}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default PlantMoisture;
