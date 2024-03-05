import { FC, useEffect } from "react";

const Weather: FC<{ quickLinkId: string }> = ({ quickLinkId }) => {
  useEffect(() => {
    const element = document.getElementById("tomorrow-widget");

    if (element && !element.hasChildNodes()) {
      window.__TOMORROW__.renderWidget();
    }
  }, []);

  return (
    <div
      id={quickLinkId}
      className="relative overflow-hidden rounded-32 bg-white p-6"
    >
      <div className="z-1000 pointer-events-none absolute left-0 top-0 h-full w-full rounded-32 border-[32px] border-white"></div>
      <div>
        <div
          id="tomorrow-widget"
          className="tomorrow"
          data-location-id="103277"
          data-language={
            localStorage.getItem("antiloop_locale")?.toUpperCase() || "SV"
          }
          data-unit-system="METRIC"
          data-skin="light"
          data-widget-type="upcoming"
        ></div>
      </div>
    </div>
  );
};

export default Weather;
