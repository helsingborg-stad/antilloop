import { FC } from "react";
import { useTranslation } from "react-i18next";
import { VariantProps, cva } from "class-variance-authority";

import TemperatureIcon from "./TemperatureIcon";
import IconButton from "@/components/IconButton";

import { cn } from "@/utils/helpers";

interface OutsideTemperatureProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  toggleInfoModal?: () => void;
  settings: {
    currentLevel: number | null;
    color: string;
    degVariant: string;
    note: string;
    image: string;
    iconVariant: string;
  };
}

const variants = cva("flex gap-4 rounded-32 bg-white", {
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

const OutsideTemperature: FC<OutsideTemperatureProps> = ({
  settings,
  variant = "default",
  toggleInfoModal
}) => {
  const quickLink = variant === "quickLink";

  const [t] = useTranslation();

  return (
    <div className={cn(variants({ variant }))}>
      <TemperatureIcon variant={settings.iconVariant} className="shrink-0" />
      <div>
        {!quickLink && (
          <IconButton
            className="absolute right-6 top-4"
            icon="info-round"
            onClick={toggleInfoModal}
            a11y={t("a11y.buttons.outside_temp_info")}
          />
        )}
        <p
          className={
            quickLink
              ? `text-lg font-medium ${settings.color}`
              : `pr-8 text-lg font-medium leading-6 ${settings.color}`
          }
        >
          {t(
            `temperature.${quickLink ? "temperature_outdoor" : "temperature"}`
          )}
        </p>
        {(settings.currentLevel || settings.currentLevel === 0) && (
          <>
            <p
              className={
                quickLink
                  ? `text-lg font-medium ${settings.color}`
                  : `text-[22px] font-medium ${settings.color}`
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
              {t("temperature.deg")} - {settings.degVariant}
            </p>
            {!quickLink && (
              <p className="text-sm text-grey-800">{settings.note}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OutsideTemperature;
