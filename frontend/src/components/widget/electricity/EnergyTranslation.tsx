import { FC, Fragment } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";

import Car from "@/assets/img/electricity/translation/car.jpg";
import Plane from "@/assets/img/electricity/translation/plane.jpg";
import Tree from "@/assets/img/electricity/translation/tree.jpg";
import Appliances from "@/assets/img/electricity/translation/appliances.jpg";
import Buns from "@/assets/img/electricity/translation/bun.jpg";
import NoData from "@/assets/img/electricity/translation/no_data.jpg";

import { ElectricityTranslation } from "@/types/school";

interface EnergyTranslationProps {
  noData?: boolean;
  selectedEnergyTranslation: string;
  settings: {
    coTwo?: string;
    timeAgo: string;
    currentLevel: number;
    buns: number;
    translations?: ElectricityTranslation["translate"];
  };
}

const EnergyTranslation: FC<EnergyTranslationProps> = ({
  noData,
  selectedEnergyTranslation,
  settings
}) => {
  const { t, i18n } = useTranslation();

  const getInterpolationValues = () => {
    if (selectedEnergyTranslation === "tree" && settings.translations) {
      return {
        co2: settings.coTwo,
        time: settings.timeAgo,
        number: Math.round(settings.translations["tree"].value)
      };
    } else if (selectedEnergyTranslation === "car" && settings.translations) {
      return {
        km: Math.round(
          settings.translations["car"][0].translation.actualDistance
        ),
        from: settings.translations["car"][0]?.translation?.destinationA,
        to: settings.translations["car"][0]?.translation?.destinationB,
        time: settings.timeAgo
      };
    } else if (selectedEnergyTranslation === "plane" && settings.translations) {
      return {
        co2: settings.coTwo,
        km: Math.round(
          settings.translations["plane"][0].translation.actualDistance
        ),
        from: settings.translations["plane"][0]?.translation?.destinationA,
        to: settings.translations["plane"][0]?.translation?.destinationB
      };
    } else if (
      selectedEnergyTranslation === "energy" &&
      settings.translations
    ) {
      return {
        time: settings.timeAgo,
        quantity: Math.round(
          settings.translations["energy"][0]?.translation?.quantity
        ),
        unit: i18n.exists(
          `ducky.energy.${settings.translations["energy"][0].translation.applianceUnit}`
        )
          ? t(
              `ducky.energy.${settings.translations["energy"][0].translation.applianceUnit}`
            )
          : settings.translations["energy"][0]?.translation?.applianceUnit,
        device: i18n.exists(
          `ducky.energy.${settings.translations["energy"][0].translation.appliance}`
        )
          ? t(
              `ducky.energy.${settings.translations["energy"][0].translation.appliance}`
            )
          : settings.translations["energy"][0]?.translation?.appliance
      };
    }
    return;
  };

  const img = () => {
    switch (selectedEnergyTranslation) {
      case "tree":
        return Tree;
      case "car":
        return Car;
      case "plane":
        return Plane;
      case "energy":
        return Appliances;
      default:
        null;
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {noData ? (
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-full flex-col"
          >
            <div className="p-6 pb-4">
              <p className="mb-2 text-2xl font-semibold">
                {t("electricity.translation_title")}
              </p>
              <p>{t("electricity.translation.no_data")}</p>
            </div>
            <div className="relative flex-grow overflow-hidden rounded-32 bg-white">
              <img
                className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                src={NoData}
                alt={t("a11y.electricity.no_data")}
              />
            </div>
          </m.div>
        ) : (
          <>
            {selectedEnergyTranslation === "buns" && (
              <m.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-full flex-col"
              >
                <div className="p-6 pb-4">
                  <p className="mb-2 text-2xl font-semibold">
                    {t("electricity.cost_title")}
                  </p>
                  <p>
                    <Trans
                      i18nKey={`electricity.translation.${selectedEnergyTranslation}`}
                      t={t}
                      values={{
                        kwh: settings.currentLevel,
                        number: settings.buns,
                        time: settings.timeAgo
                      }}
                      components={[<span className="text-lg font-bold" />]}
                    />
                  </p>
                </div>
                <div className="relative flex-grow overflow-hidden rounded-32 bg-white">
                  <img
                    className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                    src={Buns}
                    alt={t(`a11y.electricity.${selectedEnergyTranslation}`)}
                  />
                </div>
              </m.div>
            )}

            {settings.translations &&
              settings.coTwo &&
              Object.keys(settings.translations).map((key) => (
                <Fragment key={key}>
                  {selectedEnergyTranslation === key && (
                    <m.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-full flex-col"
                    >
                      <div className="p-6 pb-4">
                        <p className="mb-2 text-2xl font-semibold">
                          {t("electricity.translation_title")}
                        </p>
                        <p>
                          <Trans
                            i18nKey={`electricity.translation.${selectedEnergyTranslation}`}
                            t={t}
                            values={{
                              ...getInterpolationValues()
                            }}
                            className="text-lg"
                            components={[<span className="font-bold" />]}
                          />
                        </p>
                      </div>
                      <div className="relative flex-grow overflow-hidden rounded-32 bg-white">
                        <img
                          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                          src={img()}
                          alt={t(
                            `a11y.electricity.${selectedEnergyTranslation}`
                          )}
                        />
                      </div>
                    </m.div>
                  )}
                </Fragment>
              ))}
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default EnergyTranslation;
