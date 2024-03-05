import { FC, useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import FoodChart from "./FoodChart";
import CurrentFoodWaste from "./CurrentFoodWaste";
import Modal from "@/components/Modal";

import Meatballs from "@/assets/img/foodWaste/meatballs.jpg";

import { getWidgetData, getWidgetLatestData } from "@/api/school";
import Layout from "../Layout";
import ChartLayout from "../ChartLayout";
import CurrentLayout from "../CurrentLayout";
import EmptyChart from "../EmptyChart";

import {
  formatDate,
  substractTime,
  getStartOfDay,
  getEndOfDay
} from "@/utils/helpers";
import { getCurrentFoodWaste } from "@/utils/widgetCurrentData";
import DateRangePicker from "../DateRangePicker";

interface FoodWasteProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: any;
}

const FoodWaste: FC<FoodWasteProps> = ({
  id,
  quickLinkId,
  currentTestLevel
}) => {
  const [t] = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const now = useMemo(() => new Date(), []);

  const defaultRange = {
    from: substractTime(now, { days: 7 }).toISOString(),
    to: now.toISOString()
  };

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const [rangeUpdated, setRangeUpdated] = useState(false);
  const [range, setRange] = useState(defaultRange);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rangeModal, setRangeModal] = useState(false);
  const [settings, setSettings] = useState<{
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
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["foodWaste", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined
  });

  const { data: latestData } = useQuery({
    queryKey: ["foodWasteLatest", id],
    queryFn: () =>
      getWidgetLatestData({
        id
      }),
    enabled: currentTestLevel === undefined
  });

  useEffect(() => {
    if (currentTestLevel !== undefined && !settings) {
      const data = getCurrentFoodWaste(currentTestLevel);
      setSettings(data);
    }
    if (latestData && !settings) {
      const data = getCurrentFoodWaste(latestData.data);
      setSettings(data);
    }
  }, [latestData, settings, t, currentTestLevel]);

  useEffect(() => {
    if (ref.current && !isLoading) {
      const size = ref.current.getBoundingClientRect();
      setSize({ width: size.width, height: size.height });
    }
  }, [isLoading, latestData]);

  useEffect(() => {
    const handleWindowResize = () => {
      const size = ref.current && ref.current.getBoundingClientRect();

      size && setSize({ width: size.width, height: size.height });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const graphData =
    !isLoading && data
      ? data.map(
          (item: {
            data: { date: string; waste_in_g: number };
            assoc_data: {
              data: { items: string[] };
              data_source_key: string;
            }[];
          }) => ({
            x: formatDate(new Date(item.data.date)).dashSeparated,
            y: item.data.waste_in_g
              ? Number((item.data.waste_in_g / 1000).toFixed(1))
              : null,
            menu: item.assoc_data
              .find((item) => item.data_source_key === "school_food_menu")
              ?.data.items?.join(", ")
          })
        )
      : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  const toggleRangeModal = () => {
    setRangeModal((open) => !open);
  };

  const onRangeChange = (data: { from: Date | null; to: Date | null }) => {
    data.from &&
      data.to &&
      setRange({
        from: getStartOfDay(data.from).toISOString(),
        to: getEndOfDay(data.to).toISOString()
      });
    toggleRangeModal();
    setRangeUpdated(true);
  };

  const resetRange = () => {
    setRange(defaultRange);
    setRangeUpdated(false);
  };

  const rangeLabel = rangeUpdated
    ? `${formatDate(range.from).dotSeparated} - ${
        formatDate(range.to).dotSeparated
      }`
    : t("last_7_days");

  return (
    <Layout>
      <CurrentLayout id={quickLinkId}>
        {settings && (
          <>
            <CurrentFoodWaste
              settings={settings}
              toggleInfoModal={toggleInfoModal}
            />
            <div className="relative -mt-12 flex h-[200px] items-center gap-4 overflow-hidden rounded-32 bg-white p-4 sm:m-0 sm:h-[160px] sm:basis-1/2 md:-mt-12 md:h-[200px] md:basis-auto 2xl:mt-0 2xl:h-auto 2xl:w-[328px]">
              <LazyMotion features={domAnimation}>
                <AnimatePresence>
                  <m.img
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity:
                        settings.currentLevel && settings.meatballs ? 1 : 0.5
                    }}
                    transition={{ delay: 0.2 }}
                    className="max-h-full flex-shrink 2xl:max-h-[168px]"
                    src={Meatballs}
                    alt={t("a11y.meatballs_alt")}
                  />
                </AnimatePresence>
              </LazyMotion>
              {settings.meatballs && (
                <p className="text-lg font-semibold">
                  {t("food_waste.per_student", {
                    per_student: settings.meatballs
                  })}
                </p>
              )}
            </div>
          </>
        )}
      </CurrentLayout>
      <ChartLayout
        title={t("food_waste.food_waste_timeline")}
        rangeUpdated={rangeUpdated}
        resetRange={resetRange}
        toggleRangeModal={toggleRangeModal}
        rangeLabel={rangeLabel}
      >
        {graphData && graphData.length ? (
          <div ref={ref} className="flex h-[216px] flex-grow">
            {settings?.yRange && range ? (
              <FoodChart
                yRange={settings?.yRange}
                xRange={range}
                size={size}
                data={graphData}
                rangeUpdated={rangeUpdated}
              />
            ) : null}
          </div>
        ) : (
          !isLoading && <EmptyChart />
        )}
      </ChartLayout>

      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="food-waste-range"
      >
        <div className="no-scrollbar sm:w-[320px]">
          <DateRangePicker
            range={range}
            rangeUpdated={rangeUpdated}
            onSubmit={onRangeChange}
            onCancel={toggleRangeModal}
            maxRange="week"
          />
        </div>
      </Modal>

      <Modal
        open={infoModalOpen}
        title={t("food_waste.about")}
        toggleModal={toggleInfoModal}
        testId="food-waste-info-modal"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("food_waste.info.first")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("food_waste.info.second")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("food_waste.info.third")}
            </p>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default FoodWaste;
