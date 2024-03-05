import React, { useEffect, useRef, useMemo, useState, MouseEvent } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { eachDayOfInterval, parseISO } from "date-fns";
import { scaleBand, scaleLinear } from "d3";

import BarChartAxis from "../BarChartAxis";
import ChartGradient from "../ChartGradient";
import ChartTooltip from "../ChartTooltip";
import ChartPopup from "../ChartPopup";

import { formatDate } from "@/utils/helpers";
import "@/graph.css";

interface BarChartProps {
  data: { x: string; y: number; menu: string[] }[];
  size: { width: number; height: number };
  xRange: { from: string; to: string };
  yRange: { good: number; medium: number; bad: number };
  rangeUpdated: boolean;
}

interface BarProps {
  x?: number;
  y: number;
  height: number;
  onHover: (data: BarElement | null) => void;
  selectLast: (data: BarElement | null) => void;
  onBarClick: (data: BarElement | null) => void;
  last: boolean;
  data: { x: string; y: number; menu: string[] };
  timestampId: number;
  rangeUpdated: boolean;
}

interface BarElement {
  y: number;
  menu: string[];
  element: SVGRectElement;
  hovered?: boolean;
  touched?: boolean;
}

interface Tooltip {
  y: number;
  horizontal: number;
  vertical: number;
}

const Bar = ({
  x,
  y,
  height,
  onHover,
  selectLast,
  onBarClick,
  last,
  data,
  timestampId,
  rangeUpdated
}: BarProps) => {
  const ref = useRef<SVGRectElement>(null);
  const variants = {
    hidden: { height: 0 },
    visible: { height: height }
  };

  useEffect(() => {
    const element: SVGRectElement = ref.current as SVGRectElement;
    last &&
      !rangeUpdated &&
      element &&
      setTimeout(() => {
        selectLast({ ...data, element });
      }, 300);
  }, []);

  const onMouseOver = (e: MouseEvent<SVGRectElement>) => {
    const element: SVGRectElement = e.target as SVGRectElement;
    onHover({ ...data, element, hovered: true });
  };

  const isTouchDevice = useMemo(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    []
  );

  const onElementClick = (e: MouseEvent<SVGRectElement>) => {
    const element: SVGRectElement = e.target as SVGRectElement;
    const touched = isTouchDevice ? { touched: true } : {};
    onBarClick({ ...data, element, ...touched });
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <m.rect
          height={height}
          variants={variants}
          initial="hidden"
          animate="visible"
          x={x}
          y={y}
          width={24}
          fill={`url(#food-gradient-${timestampId})`}
          rx={12}
          onMouseOver={onMouseOver}
          onMouseOut={() => onHover(null)}
          onClick={onElementClick}
          className="cursor-pointer"
          ref={last ? ref : null}
        />
      </AnimatePresence>
    </LazyMotion>
  );
};

const FoodChart = ({
  data,
  size,
  xRange,
  yRange,
  rangeUpdated
}: BarChartProps) => {
  const [t] = useTranslation();

  const ref = useRef<HTMLDivElement>(null);

  const margin = { top: 0, right: 12, bottom: 20, left: 12 };
  const width = size.width - margin.left - margin.right;
  const height = size.height > 0 ? size.height - margin.top - margin.bottom : 0;

  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [menuTooltip, setMenuTooltip] = useState<{
    menu: string[];
    y?: number;
  } | null>(null);

  const [anchorEl, setAnchorEl] = useState<SVGRectElement | null>(null);

  useEffect(() => {
    setTooltip(null);
    setMenuTooltip(null);
  }, [rangeUpdated]);

  function createArrayOfDates(dateRange: { from: string; to: string }) {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    return eachDayOfInterval({ start, end });
  }

  const dates = createArrayOfDates(xRange);

  const scaleX = scaleBand()
    .domain(dates.map((date) => formatDate(date).dashSeparated))
    .range([0, width])
    .padding(1);

  const yMax = Math.max(...data.map(({ y }) => y));

  const scaleY = scaleLinear()
    .domain([0, yMax > yRange.bad ? yMax : yRange.bad])
    .range([height, 0]);

  const onHover = (data: BarElement | null) => {
    const container = ref.current as HTMLDivElement;

    const containerRect = container.getBoundingClientRect();

    let tooltip: Tooltip | null = null;

    if (data?.element) {
      const { x, y, width } = data.element.getBoundingClientRect();

      const horizontal = x - containerRect.x + width / 2;
      const vertical = y - containerRect.y + 20;

      tooltip = { horizontal, vertical, y: data.y };
    }

    setTooltip(tooltip);
  };

  const onBarClick = (data: BarElement | null) => {
    if (data?.menu) {
      setAnchorEl(data.element);
      const tooltip: { menu: string[]; y?: number } = { menu: data.menu };
      if (data.touched) {
        tooltip.y = data.y;
      }
      setMenuTooltip(tooltip);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const timestampId = new Date().getTime();

  const customStops = yMax > yRange.bad;

  const colorStops = [
    { color: "#973AA4", percent: 0 },
    {
      color: "#FF492C",
      percent: customStops ? 100 - (yRange.bad / yMax) * 100 : 33
    },
    {
      color: "#F6D138",
      percent: customStops ? 100 - (yRange.medium / yMax) * 100 : 66
    },
    {
      color: "#64DD41",
      percent: customStops ? 100 - (yRange.good / yMax) * 100 : 80
    },
    { color: "#43A6F9", percent: 100 }
  ];

  return (
    <div ref={ref} className="relative h-[216px] w-full md:h-full">
      <svg
        width={size.width ? size.width : 0}
        height={size.height ? size.height : 0}
        className="md:w-full"
      >
        <ChartGradient
          height={height}
          margin={margin}
          id={`food-gradient-${timestampId}`}
          colorStops={colorStops}
        />
        <g
          width={width}
          height={height}
          transform={`translate(${margin.left - 12}, ${margin.top})`}
        >
          {data.map(({ y, x, menu }, index) => {
            return (
              <React.Fragment key={`bar-${x}-bg`}>
                <rect
                  x={scaleX(x)}
                  y={0}
                  width={24}
                  height={height}
                  rx={12}
                  fill="rgba(25, 28, 30, 0.08)"
                />
                {y && (
                  <Bar
                    onHover={onHover}
                    selectLast={onHover}
                    onBarClick={onBarClick}
                    last={index === data.length - 1}
                    // x={scaleX(new Date(x))}
                    x={scaleX(x)}
                    y={scaleY(y)}
                    data={{ x, y, menu }}
                    height={height - scaleY(y)}
                    timestampId={timestampId}
                    rangeUpdated={rangeUpdated}
                  />
                )}
              </React.Fragment>
            );
          })}
        </g>
        <BarChartAxis
          width={width}
          height={height}
          margin={margin}
          scaleX={scaleX}
          scaleY={scaleY}
        />
      </svg>
      <ChartTooltip
        barChart
        show={!!tooltip && !anchorEl}
        vertical={tooltip?.vertical}
        horizontal={tooltip?.horizontal}
        value={tooltip?.y}
        unit={t("food_waste.kg")}
      />
      <ChartPopup
        anchorEl={anchorEl}
        title={t("food_waste.menu")}
        content={menuTooltip}
        a11yCloseText={t("a11y.buttons.close_menu")}
        handleClose={handleClose}
      />
    </div>
  );
};

export default FoodChart;
