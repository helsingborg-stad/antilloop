import { FC } from "react";
import { useTranslation } from "react-i18next";
import { VariantProps, cva } from "class-variance-authority";

import ElectricityIcon from "./ElectricityIcon";
import IconButton from "@/components/IconButton";

import { cn } from "@/utils/helpers";

interface ElectricityProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  toggleInfoModal?: () => void;
  settings: {
    currentLevel: number | null;
    timeAgo: string;
    coTwo?: string;
  };
}

const variants = cva("flex rounded-32 bg-white", {
  variants: {
    variant: {
      quickLink: "gap-4 p-6 h-full items-center",
      default:
        "flex-col relative flex-grow p-6 pb-4 sm:basis-1/2 2xl:basis-auto 2xl:w-[328px]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const Electricity: FC<ElectricityProps> = ({
  settings,
  variant = "default",
  toggleInfoModal
}) => {
  const quickLink = variant === "quickLink";

  const [t] = useTranslation();

  const noData = !settings.currentLevel;

  return (
    <div
      className={cn(
        variants({ variant }),
        quickLink
          ? "electricity-quick-link"
          : noData
          ? "bg-electricity-current no-data"
          : "bg-electricity-current"
      )}
    >
      {quickLink ? (
        <>
          <ElectricityIcon noData={noData} className="shrink-0" />
          <div>
            <p className="text-lg font-medium text-white">
              {t("electricity.title_quick_link")}
            </p>
            {(settings.currentLevel || settings.currentLevel === 0) && (
              <>
                <p className="text-lg font-medium text-white">
                  <span className="mr-0.5 text-[32px] font-semibold leading-[40px]">
                    {settings.currentLevel}
                  </span>
                  {t("electricity.unit")}
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-4">
            <ElectricityIcon noData={noData} className="shrink-0" />
            <div className="py-1">
              <IconButton
                className="absolute right-6 top-4"
                icon="info-round"
                iconFill="fill-white group-hover:fill-white"
                onClick={toggleInfoModal}
                a11y={t("a11y.buttons.electricity_info")}
              />
              <p className="pr-8 text-2xl font-medium leading-7 text-white">
                {t("electricity.title")}
              </p>
              {!noData ? (
                <p className="pr-8  leading-6 text-white">{settings.timeAgo}</p>
              ) : null}
            </div>
          </div>
          <div className="h-full py-[18px] text-white md:ml-20 md:py-0">
            {(settings.currentLevel || settings.currentLevel === 0) && (
              <div className="h-full md:flex md:flex-grow md:flex-col">
                <p className="mb-8 text-[22px] font-medium md:mb-0">
                  <span className="mr-1 text-[56px] font-semibold leading-[48px]">
                    {settings.currentLevel}
                  </span>
                  {t("electricity.unit")}
                </p>
                {settings.coTwo ? (
                  <div className="md:my-auto">
                    <p className="mb-2">{t("electricity.footprint_created")}</p>
                    <p className="">
                      <span className="mr-1 text-[32px] font-semibold leading-10">
                        {settings.coTwo}
                      </span>
                      {t("electricity.co2_unit")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Electricity;
