import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import CurrentPlantMoisture from "./CurrentPlantMoisture";
import Modal from "@/components/Modal";

import Image from "@/assets/img/particles100/good.jpg";

import { getWidgetLatestData } from "@/api/school";
import { getCurrentPlantMoisture } from "@/utils/widgetCurrentData";

interface PlantMoistureProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: number | null;
  img?: boolean;
}

const PlantMoisture: FC<PlantMoistureProps> = ({
  id,
  quickLinkId,
  currentTestLevel,
  img
}) => {
  const [t] = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["plantMoisture", id],
    queryFn: () => getWidgetLatestData({ id }),
    refetchInterval: 1000 * 60 * 15, // 15 minutes
    enabled: currentTestLevel === undefined,
    keepPreviousData: true
  });

  const currentLevel = currentTestLevel
    ? currentTestLevel
    : Math.round(
        (data?.data?.probe1 + data?.data?.probe2 + data?.data?.probe3) / 3
      );

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const settings =
    currentLevel || currentLevel === 0
      ? getCurrentPlantMoisture(currentLevel)
      : !isLoading
      ? {
          currentLevel: null,
          bgColor: "plant-moisture-no_data",
          level: t("plant_moisture.level.no_data"),
          note: t("plant_moisture.note.no_data"),
          iconVariant: "noData"
        }
      : currentTestLevel === null
      ? {
          currentLevel: null,
          bgColor: "plant-moisture-no_data",
          level: t("plant_moisture.level.no_data"),
          note: t("plant_moisture.note.no_data"),
          iconVariant: "noData"
        }
      : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  return (
    <>
      <div
        id={quickLinkId}
        className="flex flex-col sm:flex-row 2xl:items-center 2xl:gap-4"
      >
        <LazyMotion features={domAnimation}>
          {settings && (
            <>
              {img && (
                <div className="relative aspect-square w-full overflow-hidden rounded-t-64 sm:aspect-auto sm:h-[400px] sm:w-[400px] sm:rounded-64">
                  <img
                    className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                    src={Image}
                  />
                </div>
              )}
              <div
                className={`z-10 ${
                  img ? "-mt-14 sm:-ml-20 sm:mt-20 2xl:m-0" : ""
                } flex flex-1 flex-col 2xl:flex-row 2xl:gap-4`}
              >
                <CurrentPlantMoisture
                  settings={settings}
                  toggleInfoModal={toggleInfoModal}
                />
                <AnimatePresence>
                  <m.div
                    initial={{ translateY: 20, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="z-20 -mt-14 w-full flex-auto rounded-32 bg-white p-8 sm:-mt-16 sm:ml-10 sm:w-[360px] 2xl:m-0 2xl:flex 2xl:basis-[calc(50%-8px)] 2xl:flex-col 2xl:justify-center 2xl:px-12 2xl:py-8"
                  >
                    <h6 className="mb-2 text-2xl font-semibold">
                      {settings.level}
                    </h6>
                    <p>{settings.note}</p>
                  </m.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </LazyMotion>
      </div>
      <Modal
        open={infoModalOpen}
        title={t("plant_moisture.about")}
        toggleModal={toggleInfoModal}
        testId="plant-moisture-info-modal"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("plant_moisture.info.1")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("plant_moisture.info.2")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("plant_moisture.info.3")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("plant_moisture.info.4")}
            </p>
            <p className="rounded-2xl bg-blue-70 p-2">
              {t("plant_moisture.info.5")}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PlantMoisture;
