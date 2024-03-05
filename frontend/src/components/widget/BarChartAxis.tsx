import { useEffect, useRef } from "react";
import {
  axisBottom,
  axisLeft,
  ScaleLinear,
  ScaleBand,
  select,
  AxisDomain
} from "d3";

import "@/graph.css";
import { formatDate } from "@/utils/helpers";

interface BarChartAxisProps {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  scaleX: ScaleBand<string>;
  scaleY: ScaleLinear<number, number, never>;
}

interface AxisBottomProps {
  scale: ScaleBand<string>;
  transform: string;
  width: number;
}

interface GridProps {
  scale: ScaleLinear<number, number, never>;
  width: number;
}

const AxisBottom = ({ scale, transform, width }: AxisBottomProps) => {
  const ref = useRef<SVGGElement>(null);

  const formatTick = (d: AxisDomain) => {
    return formatDate(d as string).dayDate;
  };

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(
        axisBottom(scale)
          .tickSize(0)
          .tickPadding(10)
          .ticks(7)
          .tickFormat((value) => formatTick(value))
      );
    }
    select(".domain").remove();
  }, [scale, width]);

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

const BarChartAxis = ({
  width,
  height,
  margin,
  scaleX,
  scaleY
}: BarChartAxisProps) => {
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
      />
      <GridHorizontal width={width} scale={scaleY} />
    </g>
  );
};

export default BarChartAxis;
