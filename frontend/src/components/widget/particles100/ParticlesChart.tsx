import {
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  MouseEvent,
  TouchEvent
} from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  scaleTime,
  scaleLinear,
  curveNatural,
  pointer,
  line,
  bisector
} from "d3";

import LineChartAxis from "../LineChartAxis";
import ChartTooltip from "../ChartTooltip";
import ChartGradient from "../ChartGradient";

import "@/graph.css";
import { getDifferenceInHours } from "@/utils/helpers";

interface BarChartProps {
  data: { x: string; y: number }[];
  size: { width: number; height: number };
  xRange: { from: string; to: string };
  rangeUpdated: boolean;
}

interface Tooltip {
  y: number;
  horizontal: number;
  vertical: number;
}

const ParticlesChart = memo(
  ({ data, size, xRange, rangeUpdated }: BarChartProps) => {
    const [t] = useTranslation();

    const ref = useRef<HTMLDivElement>(null);

    const margin = { top: 14, right: 14, bottom: 20, left: 14 };

    const width = size.width - margin.left - margin.right;
    const height =
      size.height > 0 ? size.height - margin.top - margin.bottom : 0;

    const [initialTooltip, setInitialTooltip] = useState(false);
    const [tooltip, setTooltip] = useState<Tooltip | null>(null);

    const scaleX = scaleTime()
      .domain([new Date(xRange.from), new Date(xRange.to)])
      .range([15, width - 15]);
    // .nice();

    const yMax = Math.max(...data.map(({ y }) => y));

    const scaleY = scaleLinear()
      .domain([0, yMax > 68 ? yMax + 4 : 115])
      .range([height, 0]);

    const lineBuilder = line<{ x: string; y: number }>()
      .x((d) => scaleX(new Date(d.x)))
      .y((d) => scaleY(d.y))
      .curve(curveNatural);

    const linePath = lineBuilder(data);

    useEffect(() => {
      if (!initialTooltip && !rangeUpdated) {
        const x = scaleX(new Date(data[data.length - 1]?.x));
        const y = scaleY(data[data.length - 1]?.y);
        const tooltip =
          data && x && y
            ? {
                horizontal: x + 14,
                vertical: y + 8 + 14 + 2,
                y: data[data.length - 1].y
              }
            : null;
        setTimeout(() => {
          setTooltip(tooltip);
          setInitialTooltip(true);
        }, 1300);
      }
    }, [data, initialTooltip, scaleX, scaleY, rangeUpdated]);

    useEffect(() => {
      setInitialTooltip(false);
      setTooltip(null);
    }, [xRange]);

    const onHover = (
      event: MouseEvent<SVGRectElement> | TouchEvent<SVGRectElement>
    ) => {
      const mousePos = pointer(event, this);

      const date = scaleX.invert(mousePos[0]);

      const dateBisector = bisector((d: { x: string }) => new Date(d.x)).left;
      const bisectionIndex = dateBisector(data, new Date(date));
      const hoveredIndexData = data[bisectionIndex - 1];

      hoveredIndexData &&
        setTooltip({
          horizontal: scaleX(new Date(hoveredIndexData.x)) + 14,
          vertical: scaleY(hoveredIndexData.y) + 8 + 14 + 2,
          y: hoveredIndexData.y
        });
    };
    const timestampId = useMemo(() => new Date().getTime(), []);

    if (!linePath) {
      return null;
    }

    const rangeDifferenceInHours = getDifferenceInHours(
      new Date(xRange.to),
      new Date(xRange.from)
    );

    const colorStops = [
      { color: "#973AA4", percent: 0 },
      { color: "#FF492C", percent: 20 },
      { color: "#F6D138", percent: 40 },
      { color: "#64DD41", percent: 60 },
      { color: "#43A6F9", percent: 100 }
    ];

    return (
      <LazyMotion features={domAnimation}>
        <div ref={ref} className="relative h-[216px] w-full md:h-full">
          <svg
            width={size.width ? size.width : 0}
            height={size.height ? size.height : 0}
            className="md:w-full"
          >
            <ChartGradient
              height={height}
              margin={margin}
              id={`particles-100-${timestampId}`}
              colorStops={colorStops}
            />
            <g
              width={width}
              height={height}
              transform={`translate(${margin.left}, ${margin.top})`}
            >
              <m.path
                key={`${xRange.from}-${xRange.to}-bg`}
                transition={{
                  duration: 1.3,
                  ease: "easeInOut"
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={linePath}
                opacity={1}
                stroke={`url(#particles-100-${timestampId})`}
                strokeOpacity="0.2"
                fill="none"
                strokeWidth={24}
                strokeLinecap="round"
              />
              <m.path
                key={`${xRange.from}-${xRange.to}-line`}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut"
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={linePath}
                opacity={1}
                stroke={`url(#particles-100-${timestampId})`}
                fill="none"
                strokeWidth={8}
                strokeLinecap="round"
              />
              <rect
                width={size.width}
                height={size.height}
                style={{ opacity: 0 }}
                onMouseMove={onHover}
                onTouchMove={onHover}
              />
            </g>
            <LineChartAxis
              width={width}
              height={height}
              margin={margin}
              scaleX={scaleX}
              scaleY={scaleY}
              rangeUpdated={rangeUpdated}
              rangeDifferenceInHours={rangeDifferenceInHours}
            />
          </svg>
          <ChartTooltip
            show={!!tooltip}
            vertical={tooltip?.vertical}
            horizontal={tooltip?.horizontal}
            value={tooltip?.y}
            unit={t("particles.unit")}
          />
        </div>
      </LazyMotion>
    );
  }
);

export default ParticlesChart;
