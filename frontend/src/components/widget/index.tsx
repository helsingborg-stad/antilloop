import { FC } from "react";

import FoodWaste from "./foodWaste/FoodWaste";
import Menu from "./menu/Menu";
import SoundLevel from "./sound/SoundLevel";
import InsideTemperature from "./insideTemperature/InsideTemperature";
import OutsideTemperature from "./outsideTemperature/OutsideTemperature";
import Particles25 from "./particles25/Particles";
import Particles100 from "./particles100/Particles";
import CO2 from "./co2/CO2";
import PlantMoisture from "./plantMoisture/PlantMoisture";
import Weather from "./weather/Weather";
import Electricity from "./electricity/Electricity";

interface WidgetProps {
  widgetType: string;
  id: number;
}

const Widget: FC<WidgetProps> = ({ widgetType, id }) => {
  switch (widgetType) {
    case "elsys_ers_sound/noise_level_average":
      return <SoundLevel id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "food_waste_helsingborg":
      return <FoodWaste id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "school_food_menu":
      return <Menu id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "elsys_ers_co2/temperature":
      return <InsideTemperature id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "decentlab_dl_pm/air_temperature":
      return <OutsideTemperature id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "decentlab_dl_pm/pm2_5_mass_concentration":
      return <Particles25 id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "decentlab_dl_pm/pm10_0_mass_concentration":
      return <Particles100 id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "synetica_enlink/air_temperature":
      return <OutsideTemperature id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "synetica_enlink/pm2_5_mass_concentration":
      return <Particles25 id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "synetica_enlink/pm10_0_mass_concentration":
      return <Particles100 id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "elsys_ers_co2/co2":
      return <CO2 id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "yosensi_agri_box":
      return <PlantMoisture id={id} quickLinkId={`${id}-${widgetType}`} />;
    case "weather_helsingborg":
      return <Weather quickLinkId={`${id}-${widgetType}`} />;
    case "oresundskraft":
      return <Electricity id={id} quickLinkId={`${id}-${widgetType}`} />;
    default:
      return null;
  }
};

export default Widget;
