import { FC } from "react";
import { useTranslation, Trans } from "react-i18next";

import Icon from "./Icon";

const EmptyDashboard: FC = () => {
  const [t] = useTranslation();
  return (
    <section className="w-full px-4 pt-10 lg:pt-[108px]">
      <div className="mx-auto flex max-w-[560px] flex-col gap-8 rounded-32 bg-white p-10">
        <Icon name="leaves" />
        <div>
          <h1 className="mb-4 text-[22px] font-medium">
            {t("empty_dashboard_title")}
          </h1>
          <p>
            <Trans
              i18nKey="empty_dashboard_subtitle"
              t={t}
              components={[
                <a
                  className="text-blue-500 underline"
                  href="https://innovation.helsingborg.se/initiativ/antiloop-iot-baserad-klimatdata-i-klassrummen/"
                  target="_blank"
                />
              ]}
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmptyDashboard;
