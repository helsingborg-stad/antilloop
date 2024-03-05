import { FC, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import ChartLayout from "../ChartLayout";
import EmptyChart from "../EmptyChart";
import CurrentElectricity from "./CurrentElectricity";
import ElectricityChart from "./ElectricityChart";
import DateRangePicker from "../DateRangePicker";
import Modal from "@/components/Modal";

import IconButton from "@/components/IconButton";
import EnergyTranslation from "@/components/widget/electricity/EnergyTranslation";

import { getWidgetData, getWidgetLatestData } from "@/api/school";
import {
  formatDate,
  substractTime,
  getEndOfDay,
  getStartOfDay
} from "@/utils/helpers";
import { getCurrentElectricity } from "@/utils/widgetCurrentData";
import { ElectricityTranslation } from "@/types/school";

interface ElectricityProps {
  id: number;
  quickLinkId: string;
  currentTestLevel?: {
    date: string;
    kwh: number;
    duckyExample: ElectricityTranslation;
  } | null;
}

const Electricity: FC<ElectricityProps> = ({
  id,
  quickLinkId,
  currentTestLevel
}) => {
  const [t] = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const now = new Date();

  const defaultRange = {
    from: substractTime(now, { days: 7 }).toISOString(),
    to: now.toISOString()
  };

  const orderOfTranslation = ["buns", "tree", "car", "plane", "energy"];

  const [selectedEnergyTranslation, setSelectedEnergyTranslation] =
    useState("buns");

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const [rangeUpdated, setRangeUpdated] = useState(false);
  const [range, setRange] = useState(defaultRange);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rangeModal, setRangeModal] = useState(false);
  const [settings, setSettings] = useState<{
    currentLevel: number;
    timeAgo: string;
    price: number;
    buns: number;
    coTwo?: string;
    translations?: ElectricityTranslation["translate"];
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["electricity", id, range],
    queryFn: () =>
      getWidgetData({
        id,
        ...range
      }),
    enabled: currentTestLevel === undefined,
    keepPreviousData: true
  });

  const { data: latestData } = useQuery({
    queryKey: ["electricityLatest", id],
    queryFn: () =>
      getWidgetLatestData({
        id
      }),
    refetchInterval: 1000 * 60 * 15,
    enabled: currentTestLevel === undefined,
    keepPreviousData: true
  });

  const currentLevel =
    currentTestLevel !== undefined ? currentTestLevel : latestData?.data?.kwh;

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
    if (currentTestLevel !== undefined && !settings) {
      const data = getCurrentElectricity(
        currentTestLevel,
        currentTestLevel?.duckyExample
      );
      setSettings(data);
    }
    if (latestData && !settings) {
      const data = getCurrentElectricity(latestData.data, latestData.ducky);
      setSettings(data);
    }
  }, [latestData, settings, t, currentTestLevel]);

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
        (item: {
          data: {
            date: string;
            kwh: number;
          };
          ducky: { convert: { energy: { electricity: { co2e: number } } } };
        }) => ({
          x: formatDate(item.data.date).dashSeparated,
          y: Math.round(item.data.kwh),
          co2e: item.ducky?.convert?.energy.electricity.co2e
            ? Math.round(item.ducky.convert.energy.electricity.co2e)
            : undefined
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

  const onPrevClick = () => {
    const newIndex = orderOfTranslation.indexOf(selectedEnergyTranslation) - 1;

    if (newIndex < 0) {
      setSelectedEnergyTranslation(
        orderOfTranslation[orderOfTranslation.length - 1]
      );
    } else {
      setSelectedEnergyTranslation(orderOfTranslation[newIndex]);
    }
  };
  const onNextClick = () => {
    const newIndex = orderOfTranslation.indexOf(selectedEnergyTranslation) + 1;

    if (newIndex > orderOfTranslation.length - 1) {
      setSelectedEnergyTranslation(orderOfTranslation[0]);
    } else {
      setSelectedEnergyTranslation(orderOfTranslation[newIndex]);
    }
  };

  return (
    <div className="2xl:flex 2xl:gap-4">
      <div id={quickLinkId} className="md:mb-4 2xl:mb-0">
        {settings ? (
          <div className="flex flex-col gap-4 sm:flex-row">
            <CurrentElectricity
              settings={settings}
              toggleInfoModal={toggleInfoModal}
            />
            <div className="relative h-[376px] rounded-32 bg-white sm:basis-1/2 2xl:w-[328px]">
              <EnergyTranslation
                noData={!settings.currentLevel}
                selectedEnergyTranslation={selectedEnergyTranslation}
                settings={settings}
              />
              {settings.currentLevel && settings.coTwo ? (
                <div className="absolute bottom-[86px] flex w-full justify-between px-3">
                  <IconButton
                    onClick={onPrevClick}
                    a11y={t("a11y.buttons.prev_energy_conversion")}
                    variant="white"
                    icon="prev"
                  />
                  <IconButton
                    onClick={onNextClick}
                    className="rotate-180"
                    a11y={t("a11y.buttons.next_energy_conversion")}
                    variant="white"
                    icon="prev"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <ChartLayout
        rangeUpdated={rangeUpdated}
        resetRange={resetRange}
        toggleRangeModal={toggleRangeModal}
        rangeLabel={rangeLabel}
        title={t("electricity.timeline")}
      >
        {graphData && graphData.length ? (
          <div ref={ref} className="flex h-[216px] flex-grow">
            <ElectricityChart
              size={size}
              data={graphData}
              xRange={range}
              rangeUpdated={rangeUpdated}
            />
          </div>
        ) : (
          !isLoading && <EmptyChart className="md:h-[216px]" />
        )}
      </ChartLayout>

      <Modal
        open={infoModalOpen}
        title={t("electricity.about")}
        toggleModal={toggleInfoModal}
        testId="electricity-info"
      >
        <div className="no-scrollbar max-h-[65vh] max-w-[560px] overflow-y-auto">
          <div className="mb-4">
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("electricity.info.1")}
            </p>
            <p className="mb-4 rounded-2xl bg-blue-70 p-2">
              {t("electricity.info.2")}
            </p>
            <div className="mb-4 rounded-2xl bg-blue-70 p-2">
              <p>{t("electricity.info.3")}</p>
              <ul className="ml-6 mt-4 list-disc">
                <li className="mb-2">
                  <span className="mr-0.5 font-medium">
                    {t("electricity.info.4_heading")}
                  </span>
                  <span>{t("electricity.info.4")}</span>
                </li>
                <li className="mb-2">
                  <span className="mr-0.5 font-medium">
                    {t("electricity.info.5_heading")}
                  </span>
                  <span>{t("electricity.info.5")}</span>
                </li>
                <li className="mb-2">
                  <span className="mr-0.5 font-medium">
                    {t("electricity.info.6_heading")}
                  </span>
                  <span>{t("electricity.info.6")}</span>
                </li>
                <li className="mb-2">
                  <span className="mr-0.5 font-medium">
                    {t("electricity.info.7_heading")}
                  </span>
                  <span>{t("electricity.info.7")}</span>
                </li>
              </ul>
            </div>
            <p className="rounded-2xl bg-blue-70 p-2">
              {t("electricity.info.8")}
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="electricity-range"
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
    </div>
  );
};

export default Electricity;
