import { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import Layout from "../Layout";
import ChartLayout from "../ChartLayout";
import CurrentLayout from "../CurrentLayout";
import EmptyChart from "../EmptyChart";
import SoundChart from "./SoundChart";
import SoundIcon from "./SoundIcon";
import DateRangePicker from "../DateRangePicker";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";

import Good from "@/assets/img/sound/good.jpg";
import Medium from "@/assets/img/sound/medium.jpg";
import Poor from "@/assets/img/sound/poor.jpg";
import NoData from "@/assets/img/sound/no-data.jpg";

import { getWidgetData, getWidgetLatestData } from "@/api/school";

import {
  formatDate,
  substractTime,
  getEndOfDay,
  getStartOfDay
} from "@/utils/helpers";

interface SoundLevelProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: number | null;
}

const SoundLevel: FC<SoundLevelProps> = ({
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
    queryKey: ["sound", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined && visible,
    keepPreviousData: true
  });
  const { data: latestData, isLoading: isLoadingLatest } = useQuery({
    queryKey: ["soundLatest", id],
    queryFn: () =>
      getWidgetLatestData({
        id
      }),
    refetchInterval: 1000 * 60 * 15,
    keepPreviousData: true,
    enabled: currentTestLevel === undefined && visible
  });

  const currentLevel =
    currentTestLevel !== undefined
      ? currentTestLevel
      : latestData?.data?.noise_level_average;

  useEffect(() => {
    if (inView) {
      !visible && setVisible(true);
    }
  }, [inView, visible]);

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
        (item: { data: { date: string; noise_level_average: number } }) => ({
          x: item.data.date,
          y: item.data.noise_level_average
        })
      )
    : null;

  const toggleInfoModal = () => setInfoModalOpen((state) => !state);

  const variant = currentLevel
    ? currentLevel <= 60
      ? "good"
      : currentLevel <= 80
      ? "medium"
      : "poor"
    : "noData";

  const noData = variant === "noData";
  const isGood = variant === "good";
  const isMedium = variant === "medium";
  const isPoor = variant === "poor";

  const settings =
    currentLevel || currentLevel === 0
      ? {
          level: t(`sound_level.${variant}`),
          note: t(`sound_level.note.${variant}`),
          color: isMedium
            ? "text-widget-medium"
            : isPoor
            ? "text-widget-poor"
            : null,
          iconStrokeColor: isMedium
            ? "stroke-widget-medium"
            : isPoor
            ? "stroke-widget-poor"
            : null
        }
      : !isLoadingLatest
      ? {
          level: t(`sound_level.${variant}`),
          note: t(`sound_level.note.${variant}`),
          color: isMedium
            ? "text-widget-medium"
            : isPoor
            ? "text-widget-poor"
            : null,
          iconStrokeColor: isMedium
            ? "stroke-widget-medium"
            : isPoor
            ? "stroke-widget-poor"
            : null
        }
      : currentTestLevel === null
      ? {
          level: t(`sound_level.${variant}`),
          note: t(`sound_level.note.${variant}`),
          color: isMedium
            ? "text-widget-medium"
            : isPoor
            ? "text-widget-poor"
            : null,
          iconStrokeColor: isMedium
            ? "stroke-widget-medium"
            : isPoor
            ? "stroke-widget-poor"
            : null
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
              <SoundIcon
                iconStrokeColor={settings.iconStrokeColor}
                className="shrink-0"
                variant={variant}
              />
              <div>
                <IconButton
                  className="absolute right-6 top-4"
                  icon="info-round"
                  onClick={toggleInfoModal}
                  a11y={t("a11y.buttons.sound_level_info")}
                />
                <p
                  className={`pr-8 text-lg font-medium leading-6 ${
                    settings.color ? settings.color : ""
                  }`}
                >
                  {t("sound_level.now")}
                </p>
                {!noData && (
                  <>
                    <p
                      className={`text-[22px] font-medium ${
                        settings.color ? settings.color : ""
                      }`}
                    >
                      <span className="mr-0.5 text-4xl leading-[44px]">
                        {currentLevel}
                      </span>
                      {t("sound_level.db")} - {settings.level}
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
                    src={
                      isGood ? Good : isMedium ? Medium : isPoor ? Poor : NoData
                    }
                    alt={t("a11y.sound_level_alt", {
                      variant: t(`sound_level.${variant}`)
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
        title={t("sound_level.sound_timeline")}
      >
        {graphData && graphData.length ? (
          <div ref={ref} className="flex flex-grow">
            <SoundChart
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
        title={t("sound_level.about")}
        toggleModal={toggleInfoModal}
        testId="sound-level-info"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="rounded-2xl bg-blue-70 p-2">
              {t("sound_level.info")}
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="sound-level-range"
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

export default SoundLevel;
