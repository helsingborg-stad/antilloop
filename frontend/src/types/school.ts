export interface School {
  id: string;
  logo_url: string;
  main_color: string;
  name: string;
}

export interface Sensor {
  battery_level: string;
  name: string;
  status: string;
  location: string;
}

export interface Meta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_count: number;
  total_pages: number;
}

export interface Integration {
  id: number;
  key: string;
  logo_url: string | null;
  name: string;
  url: string;
  school_integrations: {
    id: number;
    status: string;
    settings: IntegrationSettings;
  }[];
  settings: IntegrationSettings;
}

interface IntegrationSettings {
  enhetKod?: string;
  api_key?: string;
  system_ids?: string;
  "Ocp-Apim-Subscription-Key"?: string;
  client?: string;
  school?: string;
}

interface Widget {
  id: number;
  sn: number;
  data_source_key: string;
  active: boolean;
}

interface Section {
  id: number;
  name: string;
  sn: number;
  link: boolean;
  background_image_url: null | string;
  theme: "food_tracker";
  widgets: Widget[];
  active: boolean;
}

export interface SchoolDashboard {
  id: number;
  name: string;
  sections: Section[];
  widgets: Widget[];
}

interface AssocData {
  id: number;
  data: {
    date: string;
    waste_in_g: number;
    waste_in_g_per_person: number;
  };
  data_source_key: string;
}

export interface MenuItem {
  id: number;
  data: {
    date: string;
    items: string[];
  };
  likes_count: number;
  created_at: string;
  assoc_data: AssocData[];
}

export interface FoodWasteLatestData {
  date: string;
  attendees_count: number;
  waste_in_g: number;
  waste_in_g_per_person: number;
}

export interface ElectricityLatestData {
  date: string;
  kwh: number;
}

export interface ElectricityTranslation {
  convert: {
    energy: {
      electricity: {
        co2e: number;
      };
    };
  };
  translate: {
    car: {
      unit: string;
      value: number;
      translation: {
        unit: string;
        vehicle: string;
        destinationA: string;
        destinationB: string;
        actualDistance: number;
      };
    }[];
    tree: { unit: string; value: number };
    plane: {
      unit: string;
      value: number;
      translation: {
        unit: string;
        flightType: string;
        destinationA: string;
        destinationB: string;
        actualDistance: number;
      };
    }[];
    energy: {
      unit: string;
      value: number;
      translation: {
        quantity: number;
        appliance: string;
        applianceUnit: string;
      };
    }[];
  };
}

export interface OutsideTemperatureLatestData {
  date: string;
  air_temperature: number;
}

export interface FoodMenuLatestData {
  date: string;
  items: string[];
}

export interface Particles25LatestData {
  date: string;
  pm2_5_mass_concentration: number;
}

export interface PlantMoistureLatestData {
  date: string;
  probe1: number;
  probe2: number;
  probe3: number;
}

export interface Particles100LatestData {
  date: string;
  pm10_0_mass_concentration: number;
}

type OverviewWidget = {
  id: number;
  sn: number;
  active: boolean;
  data_source_key: string;
  data_source_url?: string;
  latest_data:
    | FoodWasteLatestData
    | OutsideTemperatureLatestData
    | Particles25LatestData
    | Particles100LatestData;
  current_data: FoodMenuLatestData | null;
};

type OverviewSection = {
  id: number;
  name: string;
  sn: number;
  widgets: OverviewWidget[];
};

export interface SchoolOverview {
  id: number;
  name: string;
  sections: OverviewSection[];
}

export interface SchoolSettingsI {
  logo_url: string;
  main_color: string;
  name: string;
  webhook_url: string;
}
