import { FC } from "react";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";

const CurrentFootprint: FC = () => {
  const [t] = useTranslation();

  return (
    <div className="footprint-quick-link flex h-full min-h-[112px] items-center gap-4 rounded-32 p-6">
      <Icon name="footprint" />
      <div>
        <p className="text-lg font-medium text-white">
          {t("ducky.calculator")}
        </p>
        <p className="text-sm text-white">{t("ducky.by_ducky")}</p>
      </div>
    </div>
  );
};

export default CurrentFootprint;
