import { FC } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";

interface EmptyChartProps {
  className?: string;
}

const EmptyChart: FC<EmptyChartProps> = ({ className }) => {
  const [t] = useTranslation();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "-mb-2 flex h-[216px] flex-grow items-center justify-center border border-grey-700-8 md:h-auto",
            className
          )}
        >
          <p>{t("no_graph_data")}</p>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
};

export default EmptyChart;
