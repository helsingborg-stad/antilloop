import { useEffect, useRef, useCallback } from "react";
import {
  axisBottom,
  axisLeft,
  ScaleLinear,
  ScaleTime,
  select,
  timeDay,
  AxisDomain
} from "d3";

import "@/graph.css";
import { formatDate } from "@/utils/helpers";

interface LineChartAxisProps {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  scaleX: ScaleTime<number, number>;
  scaleY: ScaleLinear<number, number, never>;
  rangeUpdated: boolean;
  rangeDifferenceInHours: number;
  monthDate?: boolean;
  xRange?: { from: string; to: string };
}

interface AxisBottomProps {
  scale: ScaleTime<number, number>;
  transform: string;
  width: number;
  rangeUpdated: boolean;
  rangeDifferenceInHours: number;
  monthDate?: boolean;
  xRange?: { from: string; to: string };
}

interface GridProps {
  scale: ScaleLinear<number, number, never>;
  width: number;
}

const AxisBottom = ({
  scale,
  transform,
  width,
  rangeUpdated,
  rangeDifferenceInHours,
  monthDate,
  xRange
}: AxisBottomProps) => {
  const ref = useRef<SVGGElement>(null);

  const formatTick = useCallback(
    (d: AxisDomain) => {
      return monthDate
        ? formatDate(d as string).monthDay
        : rangeUpdated && rangeDifferenceInHours > 96
        ? formatDate(d as string).monthDay
        : rangeDifferenceInHours > 48
        ? formatDate(d as string).monthDayTime
        : formatDate(d as string).hourMinutes;
    },
    [rangeUpdated, rangeDifferenceInHours, monthDate]
  );

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(
        axisBottom(scale)
          .tickSize(0)
          .ticks(
            monthDate
              ? xRange &&
                timeDay.range(new Date(xRange?.from), new Date(xRange?.to), 1)
                  .length < Math.floor(width / 60)
                ? timeDay
                : Math.floor(width / 60)
              : rangeUpdated
              ? Math.floor(width / 120)
              : Math.floor(width / 50)
          )
          .tickPadding(10)
          .tickFormat((value) => formatTick(value))
      );
    }
    select(".domain").remove();
  }, [scale, width, formatTick, rangeUpdated, monthDate, xRange]);

  return <g ref={ref} transform={transform} />;
};

const GridHorizontal = ({ scale, width }: GridProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(
        axisLeft(scale)
          .tickSize(-width)
          .ticks(4)
          .tickFormat(() => "")
      );
    }
    select(".domain").remove();
  }, [scale, width]);

  return (
    <g stroke="rgba(25, 28, 30, 0.12)" transform="translate(0,0)" ref={ref} />
  );
};

const LineChartAxis = ({
  width,
  height,
  margin,
  scaleX,
  scaleY,
  rangeUpdated,
  rangeDifferenceInHours,
  monthDate,
  xRange
}: LineChartAxisProps) => {
  return (
    <g
      width={width}
      height={height}
      transform={`translate(${margin.left}, ${margin.top})`}
    >
      <AxisBottom
        width={width}
        scale={scaleX}
        transform={`translate(0, ${height})`}
        rangeUpdated={rangeUpdated}
        rangeDifferenceInHours={rangeDifferenceInHours}
        monthDate={monthDate}
        xRange={xRange}
      />
      <GridHorizontal width={width} scale={scaleY} />
    </g>
  );
};

export default LineChartAxis;
