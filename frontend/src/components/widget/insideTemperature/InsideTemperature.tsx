import { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import Layout from "../Layout";
import ChartLayout from "../ChartLayout";
import CurrentLayout from "../CurrentLayout";
import EmptyChart from "../EmptyChart";
import TemperatureIcon from "./TemperatureIcon";
import TemperatureChart from "./TemperatureChart";
import DateRangePicker from "../DateRangePicker";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";

import ExtremeCold from "@/assets/img/temperatureIndoor/extreme_cold.jpg";
import Cold from "@/assets/img/temperatureIndoor/cold.jpg";
import Fine from "@/assets/img/temperatureIndoor/fine.jpg";
import Comfort from "@/assets/img/temperatureIndoor/comfort.jpg";
import Hot from "@/assets/img/temperatureIndoor/hot.jpg";
import ExtremeHot from "@/assets/img/temperatureIndoor/extreme_hot.jpg";
import NoData from "@/assets/img/temperatureIndoor/no_data.jpg";

import { getWidgetData, getWidgetLatestData } from "@/api/school";
import {
  formatDate,
  substractTime,
  getEndOfDay,
  getStartOfDay
} from "@/utils/helpers";

interface InsideTemperatureProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: number | null;
}

const InsideTemperature: FC<InsideTemperatureProps> = ({
  id,
  quickLinkId,
  currentTestLevel
}) => {
  const [t] = useTranslation();

  const { ref: inViewRef, inView } = useInView();

  const ref = useRef<HTMLDivElement>(null);

  const now = new Date();

  const defaultRange = {
    from: substractTime(now, { hours: 5 }).toISOString(),
    to: now.toISOString()
  };

  const [visible, setVisible] = useState(false);

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const [rangeUpdated, setRangeUpdated] = useState(false);
  const [range, setRange] = useState(defaultRange);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rangeModal, setRangeModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["temperatureInside", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined && visible,
    keepPreviousData: true
  });

  const { data: latestData, isLoading: isLoadingLatest } = useQuery({
    queryKey: ["temperatureInsideLatest", id],
    queryFn: () =>
      getWidgetLatestData({
        id
      }),
    refetchInterval: 1000 * 60 * 15,
    keepPreviousData: true,
    enabled: currentTestLevel === undefined && visible
  });

  useEffect(() => {
    if (inView) {
      !visible && setVisible(true);
    }
  }, [inView, visible]);

  const currentLevel =
    currentTestLevel !== undefined
      ? currentTestLevel
      : latestData?.data?.temperature;

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
    ? data?.map((item: { data: { date: string; temperature: number } }) => ({
        x: item.data.date,
        y: item.data.temperature
      }))
    : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  const settings =
    currentLevel || currentLevel === 0
      ? {
          color:
            currentLevel < 14
              ? "text-blue-900"
              : currentLevel <= 16
              ? "text-blue-500"
              : currentLevel <= 19
              ? "text-lime-700"
              : currentLevel <= 24
              ? "text-yellow-900"
              : currentLevel <= 28
              ? "text-red-900"
              : currentLevel > 28
              ? "text-red-500"
              : "",
          degVariant:
            currentLevel < 14
              ? t("temperature.inside_temp.less_than14")
              : currentLevel <= 16
              ? t("temperature.inside_temp.less_than16")
              : currentLevel <= 19
              ? t("temperature.inside_temp.less_than19")
              : currentLevel <= 24
              ? t("temperature.inside_temp.less_than24")
              : currentLevel <= 28
              ? t("temperature.inside_temp.less_than28")
              : currentLevel > 28
              ? t("temperature.inside_temp.more_than28")
              : "",
          note:
            currentLevel < 14
              ? t("temperature.inside_note.less_than14")
              : currentLevel <= 16
              ? t("temperature.inside_note.less_than16")
              : currentLevel <= 19
              ? t("temperature.inside_note.less_than19")
              : currentLevel <= 24
              ? t("temperature.inside_note.less_than24")
              : currentLevel <= 28
              ? t("temperature.inside_note.less_than28")
              : currentLevel > 28
              ? t("temperature.inside_note.more_than28")
              : "",
          image:
            currentLevel < 14
              ? ExtremeCold
              : currentLevel <= 16
              ? Cold
              : currentLevel <= 19
              ? Fine
              : currentLevel <= 24
              ? Comfort
              : currentLevel <= 28
              ? Hot
              : currentLevel > 28
              ? ExtremeHot
              : NoData,
          iconVariant:
            currentLevel < 14
              ? "extremeCold"
              : currentLevel <= 16
              ? "cold"
              : currentLevel <= 19
              ? "fine"
              : currentLevel <= 24
              ? "comfort"
              : currentLevel <= 28
              ? "hot"
              : currentLevel > 28
              ? "extremeHot"
              : "noData"
        }
      : !isLoadingLatest
      ? {
          color: "",
          degVariant: "",
          note: "",
          image: NoData,
          iconVariant: "noData"
        }
      : currentTestLevel === null
      ? {
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
    : t("last_5h");

  return (
    <Layout ref={!visible ? inViewRef : null}>
      <CurrentLayout id={quickLinkId}>
        {settings ? (
          <>
            <div className="relative flex min-h-[128px] flex-grow gap-4 rounded-32 bg-white p-6 pb-16 sm:basis-1/2 sm:pb-4 md:basis-auto md:pb-16 2xl:w-[328px]">
              <TemperatureIcon
                variant={settings.iconVariant}
                className="shrink-0"
              />
              <div>
                <IconButton
                  className="absolute right-6 top-4"
                  icon="info-round"
                  onClick={toggleInfoModal}
                  a11y={t("a11y.buttons.inside_temp_info")}
                />
                <p
                  className={`pr-8 text-lg font-medium leading-6 ${settings.color}`}
                >
                  {t("temperature.temperature")}
                </p>
                {(currentLevel || currentLevel === 0) && (
                  <>
                    <p className={`text-[22px] font-medium ${settings.color}`}>
                      <span className="text-4xl leading-[44px]">
                        {currentLevel}
                      </span>
                      {t("temperature.deg")} - {settings.degVariant}
                    </p>
                    <p className="text-sm text-grey-800">{settings.note}</p>
                  </>
                )}
              </div>
            </div>
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
                    alt={t("a11y.temp_inside_alt", {
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
        title={t("temperature.indor_about")}
        toggleModal={toggleInfoModal}
        testId="temperature-inside-info"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("temperature.indor_info.1")}
            </p>
            <div className="rounded-2xl bg-blue-70 p-2">
              <p className="">{t("temperature.indor_info.2")}</p>
              <ol className="mt-2 list-decimal space-y-2 pl-5">
                <li>{t("temperature.indor_info.3")}</li>
                <li>{t("temperature.indor_info.4")}</li>
                <li>{t("temperature.indor_info.5")}</li>
                <li>{t("temperature.indor_info.6")}</li>
                <li>{t("temperature.indor_info.7")}</li>
              </ol>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="inside-temperature-range"
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

export default InsideTemperature;
