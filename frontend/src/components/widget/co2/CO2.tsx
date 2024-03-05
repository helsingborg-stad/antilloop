import { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import Layout from "../Layout";
import ChartLayout from "../ChartLayout";
import CurrentLayout from "../CurrentLayout";
import EmptyChart from "../EmptyChart";
import CO2Icon from "./CO2Icon";
import CO2Chart from "./CO2Chart";
import DateRangePicker from "../DateRangePicker";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";

import Good from "@/assets/img/co2/good.jpg";
import Excellent from "@/assets/img/co2/excellent.jpg";
import Fair from "@/assets/img/co2/fair.jpg";
import Poor from "@/assets/img/co2/poor.jpg";
import Bad from "@/assets/img/co2/bad.jpg";
import NoData from "@/assets/img/co2/no_data.jpg";

import { getWidgetData, getWidgetLatestData } from "@/api/school";
import {
  formatDate,
  substractTime,
  getEndOfDay,
  getStartOfDay
} from "@/utils/helpers";

interface CO2Props {
  id: number;
  currentTestLevel?: number | null;
  quickLinkId: string;
}

const COtwo: FC<CO2Props> = ({ id, quickLinkId, currentTestLevel }) => {
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
    queryKey: ["co2", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined && visible,
    keepPreviousData: true
  });

  const { data: latestData, isLoading: isLoadingLatest } = useQuery({
    queryKey: ["co2Latest", id],
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
    currentTestLevel !== undefined ? currentTestLevel : latestData?.data?.co2;

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
    if (ref.current && !isLoading && !isLoadingLatest) {
      const size = ref.current.getBoundingClientRect();
      setSize({ width: size.width, height: size.height });
    }
  }, [isLoading, currentLevel, isLoadingLatest]);

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
    ? data?.map((item: { data: { date: string; co2: number } }) => ({
        x: item.data.date,
        y: item.data.co2
      }))
    : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  const settings =
    currentLevel || currentLevel === 0
      ? {
          color:
            currentLevel <= 400
              ? "text-blue-500"
              : currentLevel <= 600
              ? "text-lime-700"
              : currentLevel <= 800
              ? "text-yellow-900"
              : currentLevel <= 1000
              ? "text-red-900"
              : currentLevel > 1000
              ? "text-red-500"
              : "",
          degVariant:
            currentLevel <= 400
              ? t("co2.level.excellent")
              : currentLevel <= 600
              ? t("co2.level.good")
              : currentLevel <= 800
              ? t("co2.level.fair")
              : currentLevel <= 1000
              ? t("co2.level.poor")
              : currentLevel > 1000
              ? t("co2.level.bad")
              : "",
          note:
            currentLevel <= 400
              ? t("co2.note.excellent")
              : currentLevel <= 600
              ? t("co2.note.good")
              : currentLevel <= 800
              ? t("co2.note.fair")
              : currentLevel <= 1000
              ? t("co2.note.poor")
              : currentLevel > 1000
              ? t("co2.note.bad")
              : "",
          image:
            currentLevel <= 400
              ? Excellent
              : currentLevel <= 600
              ? Good
              : currentLevel <= 800
              ? Fair
              : currentLevel <= 1000
              ? Poor
              : currentLevel > 1000
              ? Bad
              : "",
          iconVariant:
            currentLevel <= 400
              ? "excellent"
              : currentLevel <= 600
              ? "good"
              : currentLevel <= 800
              ? "fair"
              : currentLevel <= 1000
              ? "poor"
              : currentLevel > 1000
              ? "bad"
              : ""
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
              <CO2Icon variant={settings.iconVariant} className="shrink-0" />
              <div>
                <IconButton
                  className="absolute right-6 top-4"
                  icon="info-round"
                  onClick={toggleInfoModal}
                  a11y={t("a11y.buttons.co2_info")}
                />
                <p
                  className={`pr-8 text-lg font-medium leading-6 ${settings.color}`}
                >
                  {t("co2.title")}
                </p>
                {(currentLevel || currentLevel === 0) && (
                  <>
                    <p className={`text-[22px] font-medium ${settings.color}`}>
                      <span className="mr-0.5 text-4xl leading-[44px]">
                        {currentLevel}
                      </span>
                      {t("co2.unit")} - {settings.degVariant}
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
                    alt={t("a11y.co2_alt", {
                      cotwo: settings.degVariant
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
        title={t("co2.timeline")}
      >
        {graphData && graphData.length ? (
          <div ref={ref} className="flex flex-grow">
            <CO2Chart
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
        title={t("co2.about")}
        toggleModal={toggleInfoModal}
        testId="co2-info"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">{t("co2.info.1")}</p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">{t("co2.info.2")}</p>
            <p className="rounded-2xl bg-blue-70 p-2">{t("co2.info.3")}</p>
          </div>
        </div>
      </Modal>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="co2-range"
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

export default COtwo;
