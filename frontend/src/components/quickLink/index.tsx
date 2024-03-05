import { FC } from "react";

import FoodWaste from "@/components/widget/foodWaste/CurrentFoodWaste";
import OutsideTemperature from "@/components/widget/outsideTemperature/CurrentOutsideTemperature";
import Particles25 from "@/components/widget/particles25/CurrentParticles";
import Particles100 from "@/components/widget/particles100/CurrentParticles";
import CurrentPlantMoisture from "@/components/widget/plantMoisture/CurrentPlantMoisture";
import Menu from "@/components/widget/menu/CurrentMenu";
import CurrentWeather from "@/components/widget/weather/CurrentWeather";
import CurrentElectricity from "@/components/widget/electricity/CurrentElectricity";
import CurrentFootprint from "@/components/widget/footprintCalculator/CurrentFootprint";

import {
  getCurrentElectricity,
  getCurrentFoodWaste,
  getCurrentOutsideTemperature,
  getCurrentParticles25,
  getCurrentPlantMoisture
} from "@/utils/widgetCurrentData";
import {
  FoodWasteLatestData,
  OutsideTemperatureLatestData,
  Particles25LatestData,
  Particles100LatestData,
  PlantMoistureLatestData,
  FoodMenuLatestData,
  ElectricityLatestData
} from "@/types/school";

interface WidgetProps {
  widgetType: string;
  latestData:
    | FoodWasteLatestData
    | OutsideTemperatureLatestData
    | Particles25LatestData
    | Particles100LatestData
    | PlantMoistureLatestData
    | ElectricityLatestData;
  currentData: FoodMenuLatestData | null;
}

const Widget: FC<WidgetProps> = ({ widgetType, latestData, currentData }) => {
  switch (widgetType) {
    case "food_waste_helsingborg": {
      const settings = getCurrentFoodWaste(latestData as FoodWasteLatestData);
      return <FoodWaste variant="quickLink" settings={settings} />;
    }
    case "school_food_menu": {
      const data = currentData as FoodMenuLatestData;
      return <Menu latestData={data} />;
    }
    case "decentlab_dl_pm/air_temperature": {
      const data = latestData as OutsideTemperatureLatestData;
      const settings = getCurrentOutsideTemperature(data.air_temperature);
      return <OutsideTemperature settings={settings} variant="quickLink" />;
    }
    case "decentlab_dl_pm/pm2_5_mass_concentration": {
      const data = latestData as Particles25LatestData;
      const settings = getCurrentParticles25(data.pm2_5_mass_concentration);
      return <Particles25 settings={settings} variant="quickLink" />;
    }
    case "decentlab_dl_pm/pm10_0_mass_concentration": {
      const data = latestData as Particles100LatestData;
      const settings = getCurrentParticles25(data.pm10_0_mass_concentration);
      return <Particles100 settings={settings} variant="quickLink" />;
    }
    case "synetica_enlink/air_temperature": {
      const data = latestData as OutsideTemperatureLatestData;
      const settings = getCurrentOutsideTemperature(data.air_temperature);
      return <OutsideTemperature settings={settings} variant="quickLink" />;
    }
    case "synetica_enlink/pm2_5_mass_concentration": {
      const data = latestData as Particles25LatestData;
      const settings = getCurrentParticles25(data.pm2_5_mass_concentration);
      return <Particles25 settings={settings} variant="quickLink" />;
    }
    case "synetica_enlink/pm10_0_mass_concentration": {
      const data = latestData as Particles100LatestData;
      const settings = getCurrentParticles25(data.pm10_0_mass_concentration);
      return <Particles100 settings={settings} variant="quickLink" />;
    }
    case "yosensi_agri_box": {
      const data = latestData as PlantMoistureLatestData;
      const level = Math.round((data.probe1 + data.probe2 + data.probe3) / 3);
      const settings = getCurrentPlantMoisture(level);
      return <CurrentPlantMoisture settings={settings} variant="quickLink" />;
    }
    case "oresundskraft": {
      const settings = getCurrentElectricity(
        latestData as ElectricityLatestData
      );
      return <CurrentElectricity settings={settings} variant="quickLink" />;
    }
    case "weather_helsingborg": {
      return <CurrentWeather />;
    }
    case "footprint_calculator": {
      return <CurrentFootprint />;
    }
    default:
      return null;
  }
};

export default Widget;
