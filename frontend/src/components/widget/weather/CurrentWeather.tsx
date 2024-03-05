import { FC } from "react";
import { useTranslation } from "react-i18next";

import Icon from "@/components/Icon";

const CurrentWeather: FC = () => {
  const [t] = useTranslation();

  return (
    <div className="weather-quick-link flex h-full min-h-[112px] items-center gap-4 rounded-32 p-6">
      <Icon name="weather" />
      <p className="text-lg font-medium text-white">{t("weather_forecast")}</p>
    </div>
  );
};

export default CurrentWeather;
