import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import IconButton from "@/components/IconButton";
import FilterButton from "@/components/FilterButton";

interface ChartLayoutProps {
  children: React.ReactNode;
  rangeUpdated: boolean;
  resetRange: () => void;
  toggleRangeModal: () => void;
  rangeLabel: string;
  title: string;
}

const ChartLayout: FC<ChartLayoutProps> = ({
  children,
  rangeUpdated,
  resetRange,
  toggleRangeModal,
  rangeLabel,
  title
}) => {
  const [t] = useTranslation();

  return (
    <div className="mt-4 min-h-[328px] rounded-32 bg-white p-6 pb-8 transition-all md:mt-0 md:flex-grow">
      <div className="flex h-full flex-col items-stretch">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h4 className="font-medium">{title}</h4>
          <div>
            {rangeUpdated && (
              <IconButton
                size="small"
                variant="grey"
                className="mr-2"
                icon="close"
                onClick={resetRange}
                a11y={t("a11y.buttons.reset_selected_range")}
              />
            )}
            <FilterButton onClick={toggleRangeModal} label={rangeLabel} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ChartLayout;
