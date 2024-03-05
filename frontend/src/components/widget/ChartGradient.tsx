interface ChartGradientProps {
  id: string;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  colorStops: { color: string; percent: number }[];
}

const ChartGradient = ({
  id,
  height,
  margin,
  colorStops
}: ChartGradientProps) => {
  return (
    <defs>
      <linearGradient
        id={id}
        gradientTransform="rotate(90)"
        x1="0"
        x2={height + margin.top + margin.bottom}
        gradientUnits="userSpaceOnUse"
      >
        {colorStops.map((item) => {
          return (
            <stop
              key={item.percent}
              offset={`${item.percent}%`}
              stopColor={item.color}
              stopOpacity={1}
            />
          );
        })}
      </linearGradient>
    </defs>
  );
};

export default ChartGradient;
