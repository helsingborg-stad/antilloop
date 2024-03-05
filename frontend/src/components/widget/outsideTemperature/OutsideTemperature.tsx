import { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import Layout from "../Layout";
import ChartLayout from "../ChartLayout";
import CurrentLayout from "../CurrentLayout";
import EmptyChart from "../EmptyChart";
import CurrentOutsideTemperature from "./CurrentOutsideTemperature";
import TemperatureChart from "./TemperatureChart";
import DateRangePicker from "../DateRangePicker";
import Modal from "@/components/Modal";

import NoData from "@/assets/img/temperatureOutdoor/no_data.jpg";

import { getWidgetData, getWidgetLatestData } from "@/api/school";
import {
  formatDate,
  substractTime,
  getEndOfDay,
  getStartOfDay
} from "@/utils/helpers";
import { getCurrentOutsideTemperature } from "@/utils/widgetCurrentData";

interface OutsideTemperatureProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: number | null;
}

const OutsideTemperature: FC<OutsideTemperatureProps> = ({
  id,
  quickLinkId,
  currentTestLevel
}) => {
  const [t] = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const now = new Date();

  const defaultRange = {
    from: substractTime(now, { hours: 24 }).toISOString(),
    to: now.toISOString()
  };

  // const [visible, setVisible] = useState(false);

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const [rangeUpdated, setRangeUpdated] = useState(false);
  const [range, setRange] = useState(defaultRange);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rangeModal, setRangeModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["temperatureOutside", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined,
    keepPreviousData: true
  });

  const { data: latestData, isLoading: isLoadingLatest } = useQuery({
    queryKey: ["temperatureOutsideLatest", id],
    queryFn: () =>
      getWidgetLatestData({
        id
      }),
    refetchInterval: 1000 * 60 * 15,
    enabled: currentTestLevel === undefined,
    keepPreviousData: true
  });

  const currentLevel =
    currentTestLevel !== undefined
      ? currentTestLevel
      : latestData?.data?.air_temperature;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const defaultRange = {
        from: substractTime(now, { hours: 5 }).toISOString(),
        to: now.toISOString()
      };
      !rangeUpdated && setRange(defaultRange);
    }, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, [rangeUpdated]);

  useEffect(() => {
    if (ref.current && !isLoading) {
      const size = ref.current.getBoundingClientRect();
      setSize({ width: size.width, height: size.height });
    }
  }, [isLoading, currentLevel]);

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

  const graphData = data
    ? data?.map(
        (item: { data: { date: string; air_temperature: number } }) => ({
          x: item.data.date,
          y: item.data.air_temperature
        })
      )
    : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  const settings =
    currentLevel || currentLevel === 0
      ? getCurrentOutsideTemperature(currentLevel)
      : !isLoadingLatest
      ? {
          currentLevel: null,
          color: "",
          degVariant: "",
          note: "",
          image: NoData,
          iconVariant: "noData"
        }
      : currentTestLevel === null
      ? {
          currentLevel: null,
          color: "",
          degVariant: "",
          note: "",
          image: NoData,
          iconVariant: "noData"
        }
      : null;

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
    : t("last_24h");

  return (
    <Layout>
      <CurrentLayout id={quickLinkId}>
        {settings ? (
          <>
            <CurrentOutsideTemperature
              settings={settings}
              toggleInfoModal={toggleInfoModal}
            />
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                <m.div
                  initial={{ translateY: -20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative -mt-12 h-[200px] overflow-hidden rounded-32 sm:m-0 sm:aspect-auto sm:h-[160px] sm:basis-1/2 md:-mt-12 md:h-[200px] md:basis-auto 2xl:mt-0 2xl:h-auto 2xl:w-[328px]"
                >
                  <img
                    className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover sm:h-auto 2xl:min-h-full"
                    src={settings.image}
                    alt={t("a11y.temp_outside_alt", {
                      temp: settings.degVariant
                    })}
                  />
                </m.div>
              </AnimatePresence>
            </LazyMotion>
          </>
        ) : null}
      </CurrentLayout>
      <ChartLayout
        rangeUpdated={rangeUpdated}
        resetRange={resetRange}
        toggleRangeModal={toggleRangeModal}
        rangeLabel={rangeLabel}
        title={t("temperature.inside_timeline")}
      >
        {graphData && graphData.length ? (
          <div ref={ref} className="flex flex-grow">
            <TemperatureChart
              size={size}
              data={graphData}
              xRange={range}
              rangeUpdated={rangeUpdated}
            />
          </div>
        ) : (
          !isLoading && <EmptyChart />
        )}
      </ChartLayout>

      <Modal
        open={infoModalOpen}
        title={t("temperature.outside_about")}
        toggleModal={toggleInfoModal}
        testId="temperature-outside-info"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("temperature.outdor_info.1")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("temperature.outdor_info.2")}
            </p>
            <p className="rounded-2xl bg-blue-70 p-2">
              {t("temperature.outdor_info.3")}
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="outside-temperature-range"
      >
        <div className="no-scrollbar sm:w-[320px]">
          <DateRangePicker
            range={range}
            rangeUpdated={rangeUpdated}
            onSubmit={onRangeChange}
            onCancel={toggleRangeModal}
            maxRange="year"
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default OutsideTemperature;
