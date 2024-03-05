import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

interface ChartTooltipProps {
  horizontal?: number;
  vertical?: number;
  show: boolean;
  value?: number;
  unit: string;
  barChart?: boolean;
  additionalValue?: number;
  additionalUnit?: string;
}

const ChartTooltip = ({
  show,
  vertical,
  horizontal,
  value,
  unit,
  barChart,
  additionalValue,
  additionalUnit
}: ChartTooltipProps) => {
  const initial = barChart && vertical ? { top: vertical - 10 } : {};

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {show && (
          <m.div
            initial={{ opacity: 0, ...initial }}
            animate={{
              opacity: 1,
              top: vertical,
              left: horizontal
            }}
            exit={{ opacity: 0 }}
            style={{ left: horizontal, top: vertical }}
            className="pointer-events-none absolute -translate-x-1/2 rounded-2xl bg-white px-2 py-4 shadow-tooltip"
          >
            <p className="text-2xl font-bold sm:text-[32px]">
              {value}
              <span className="ml-0.5 text-xs text-grey-400">{unit}</span>
            </p>
            {additionalValue ? (
              <p className="mt-1 text-sm font-bold sm:text-xl">
                {additionalValue}
                <span className="ml-0.5 whitespace-nowrap text-xs font-medium text-grey-400">
                  {additionalUnit}
                </span>
              </p>
            ) : null}
            <span className="absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-black"></span>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default ChartTooltip;
