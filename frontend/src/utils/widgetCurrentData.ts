import i18n from "@/i18n";
import {
  getDifferenceInCalendarDays,
  isDateToday,
  isDateYesterday
} from "@/utils/helpers";
import {
  FoodWasteLatestData,
  ElectricityLatestData,
  ElectricityTranslation
} from "@/types/school";

// outside temperature images
import OutsideTempExtremeCold from "@/assets/img/temperatureOutdoor/extreme_cold.jpg";
import OutsideTempFrosty from "@/assets/img/temperatureOutdoor/frosty.jpg";
import OutsideTempColdBelow0 from "@/assets/img/temperatureOutdoor/cold_below_0.jpg";
import OutsideTempColdAbove0 from "@/assets/img/temperatureOutdoor/cold_above_0.jpg";
import OutsideTempCool from "@/assets/img/temperatureOutdoor/cool.jpg";
import OutsideTempWarm from "@/assets/img/temperatureOutdoor/warm.jpg";
import OutsideTempHeat from "@/assets/img/temperatureOutdoor/heat.jpg";
import OutsideTempExtremeHeat from "@/assets/img/temperatureOutdoor/extreme_heat.jpg";
// import NoData from "@/assets/img/temperatureOutdoor/no_data.jpg";

// particles 25
import Particles25Good from "@/assets/img/particles25/good.jpg";
import Particles25Moderate from "@/assets/img/particles25/moderate.jpg";
import Particles25Poor from "@/assets/img/particles25/poor.jpg";
import Particles25Bad from "@/assets/img/particles25/bad.jpg";
// import NoData from "@/assets/img/particles25/no_data.jpg";

// particles 100
import Particles100Good from "@/assets/img/particles100/good.jpg";
import Particles100Moderate from "@/assets/img/particles100/moderate.jpg";
import Particles100Poor from "@/assets/img/particles100/poor.jpg";
import Particles100Bad from "@/assets/img/particles100/bad.jpg";
// import Particles100NoData from "@/assets/img/particles100/no_data.jpg";

export const getCurrentFoodWaste = (latestData: FoodWasteLatestData) => {
  if (latestData.waste_in_g) {
    const currentLevel = latestData.waste_in_g / 1000;

    const numberOfStudents = latestData.attendees_count;

    const yRange = {
      good: (9 / 1000) * numberOfStudents,
      medium: (20 / 1000) * numberOfStudents,
      bad: (30 / 1000) * numberOfStudents
    };

    const formatNumber = (num: number) => {
      const rounded = Math.round(num * 100) / 100;
      return Number.isInteger(rounded) ? rounded : rounded.toFixed(1);
    };
    const meatballs = Number(
      formatNumber(latestData.waste_in_g_per_person / 12.5)
    );

    const gramPerStudent = currentLevel
      ? (currentLevel / numberOfStudents) * 1000
      : 0;

    const latestDataDate = new Date(latestData.date);
    const latestDataDifferenceFromNow =
      latestDataDate && getDifferenceInCalendarDays(new Date(), latestDataDate);

    const timeAgo =
      latestDataDate && isDateToday(latestDataDate)
        ? i18n.t("today")
        : latestDataDate && isDateYesterday(latestDataDate)
        ? i18n.t("yesterday")
        : i18n.t("days_ago", { days: latestDataDifferenceFromNow });

    const variant =
      gramPerStudent <= 9 ? "good" : gramPerStudent <= 20 ? "medium" : "poor";

    const note = i18n.t(`food_waste.note.${variant}`);

    const binIcon =
      variant === "poor"
        ? 90
        : variant === "medium"
        ? 50
        : variant === "good"
        ? 15
        : 0;

    return {
      date: latestData.date,
      currentLevel: Number(currentLevel.toFixed(1)),
      numberOfStudents,
      yRange,
      meatballs,
      gramPerStudent,
      timeAgo,
      variant,
      note,
      binIcon
    };
  } else {
    const yRange = {
      good: (9 / 1000) * 100,
      medium: (20 / 1000) * 100,
      bad: (30 / 1000) * 100
    };
    return {
      date: latestData.date,
      currentLevel: null,
      numberOfStudents: null,
      yRange,
      meatballs: null,
      gramPerStudent: null,
      timeAgo: "",
      variant: "",
      note: "",
      binIcon: 0
    };
  }
};

export const getCurrentOutsideTemperature = (currentLevel: number) => {
  return {
    currentLevel: currentLevel,
    color:
      currentLevel < -25
        ? "text-blue-900"
        : currentLevel <= 0
        ? "text-blue-500"
        : currentLevel < 16
        ? "text-green-700"
        : currentLevel < 25
        ? "text-yellow-900"
        : currentLevel < 36
        ? "text-red-900"
        : currentLevel >= 36
        ? "text-red-500"
        : "",
    degVariant:
      currentLevel < -25
        ? i18n.t("temperature.outside_temp.less_than-25")
        : currentLevel <= -10
        ? i18n.t("temperature.outside_temp.less_than-10")
        : currentLevel <= 8
        ? i18n.t("temperature.outside_temp.less_than8")
        : currentLevel <= 15
        ? i18n.t("temperature.outside_temp.less_than15")
        : currentLevel <= 25
        ? i18n.t("temperature.outside_temp.less_than25")
        : currentLevel <= 35
        ? i18n.t("temperature.outside_temp.less_than35")
        : currentLevel > 35
        ? i18n.t("temperature.outside_temp.less_than-25")
        : "",
    note:
      currentLevel < -25
        ? i18n.t("temperature.outside_note.less_than-25")
        : currentLevel <= -10
        ? i18n.t("temperature.outside_note.less_than-10")
        : currentLevel <= 8
        ? i18n.t("temperature.outside_note.less_than8")
        : currentLevel <= 15
        ? i18n.t("temperature.outside_note.less_than15")
        : currentLevel < 25
        ? i18n.t("temperature.outside_note.less_than25")
        : currentLevel <= 35
        ? i18n.t("temperature.outside_note.less_than35")
        : currentLevel > 35
        ? i18n.t("temperature.outside_note.more_than35")
        : "",
    image:
      currentLevel < -25
        ? OutsideTempExtremeCold
        : currentLevel <= -10
        ? OutsideTempFrosty
        : currentLevel <= 0
        ? OutsideTempColdBelow0
        : currentLevel <= 8
        ? OutsideTempColdAbove0
        : currentLevel <= 15
        ? OutsideTempCool
        : currentLevel <= 25
        ? OutsideTempWarm
        : currentLevel <= 35
        ? OutsideTempHeat
        : currentLevel > 35
        ? OutsideTempExtremeHeat
        : "",
    iconVariant:
      currentLevel < -25
        ? "extremeCold"
        : currentLevel <= 0
        ? "coldBelow"
        : currentLevel <= 8
        ? "coldAbove"
        : currentLevel <= 15
        ? "cool"
        : currentLevel <= 25
        ? "warm"
        : currentLevel <= 35
        ? "heat"
        : "extremeHeat"
  };
};

export const getCurrentParticles25 = (currentLevel: number) => {
  return {
    currentLevel: Number(currentLevel.toFixed(1)),
    color:
      currentLevel <= 10
        ? "text-blue-500"
        : currentLevel <= 15
        ? "text-lime-700"
        : currentLevel <= 25
        ? "text-yellow-900"
        : currentLevel > 25
        ? "text-red-500"
        : "",
    degVariant:
      currentLevel <= 10
        ? i18n.t("particles.level.good")
        : currentLevel <= 15
        ? i18n.t("particles.level.moderate")
        : currentLevel <= 25
        ? i18n.t("particles.level.poor")
        : currentLevel > 25
        ? i18n.t("particles.level.bad")
        : "",
    note:
      currentLevel <= 10
        ? i18n.t("particles.25_note.good")
        : currentLevel <= 15
        ? i18n.t("particles.25_note.moderate")
        : currentLevel <= 25
        ? i18n.t("particles.25_note.poor")
        : currentLevel > 25
        ? i18n.t("particles.25_note.bad")
        : "",
    image:
      currentLevel <= 10
        ? Particles25Good
        : currentLevel <= 15
        ? Particles25Moderate
        : currentLevel <= 25
        ? Particles25Poor
        : currentLevel > 25
        ? Particles25Bad
        : "",
    iconVariant:
      currentLevel <= 10
        ? "good"
        : currentLevel <= 15
        ? "moderate"
        : currentLevel <= 25
        ? "poor"
        : currentLevel > 25
        ? "bad"
        : ""
  };
};

export const getCurrentParticles100 = (currentLevel: number) => {
  return {
    currentLevel: Number(currentLevel.toFixed(1)),
    color:
      currentLevel <= 30
        ? "text-blue-500"
        : currentLevel <= 50
        ? "text-lime-700"
        : currentLevel <= 100
        ? "text-yellow-900"
        : currentLevel > 100
        ? "text-red-500"
        : "",
    degVariant:
      currentLevel <= 30
        ? i18n.t("particles.level.good")
        : currentLevel <= 50
        ? i18n.t("particles.level.moderate")
        : currentLevel <= 100
        ? i18n.t("particles.level.poor")
        : currentLevel > 100
        ? i18n.t("particles.level.bad")
        : "",
    note:
      currentLevel <= 30
        ? i18n.t("particles.100_note.good")
        : currentLevel <= 50
        ? i18n.t("particles.100_note.moderate")
        : currentLevel <= 100
        ? i18n.t("particles.100_note.poor")
        : currentLevel > 100
        ? i18n.t("particles.100_note.bad")
        : "",
    image:
      currentLevel <= 30
        ? Particles100Good
        : currentLevel <= 50
        ? Particles100Moderate
        : currentLevel <= 100
        ? Particles100Poor
        : currentLevel > 100
        ? Particles100Bad
        : "",
    iconVariant:
      currentLevel <= 30
        ? "good"
        : currentLevel <= 50
        ? "moderate"
        : currentLevel <= 100
        ? "poor"
        : currentLevel > 100
        ? "bad"
        : ""
  };
};

export const getCurrentPlantMoisture = (currentLevel: number) => {
  return {
    currentLevel,
    bgColor:
      currentLevel < 20
        ? "plant-moisture-dry"
        : currentLevel < 40
        ? "plant-moisture-ok"
        : currentLevel >= 40
        ? "plant-moisture-wet"
        : "",
    level:
      currentLevel < 20
        ? i18n.t("plant_moisture.level.dry")
        : currentLevel < 40
        ? i18n.t("plant_moisture.level.ok")
        : currentLevel >= 40
        ? i18n.t("plant_moisture.level.wet")
        : "",
    note:
      currentLevel < 20
        ? i18n.t("plant_moisture.note.dry")
        : currentLevel < 40
        ? i18n.t("plant_moisture.note.ok")
        : currentLevel >= 40
        ? i18n.t("plant_moisture.note.wet")
        : "",
    iconVariant:
      currentLevel < 20
        ? "dry"
        : currentLevel < 40
        ? "ok"
        : currentLevel >= 40
        ? "wet"
        : ""
  };
};

export const getCurrentElectricity = (
  latestData: ElectricityLatestData | null,
  ducky?: ElectricityTranslation
) => {
  const currentLevel = latestData ? latestData.kwh : NaN;
  const latestDataDate = latestData ? new Date(latestData?.date) : "";
  const latestDataDifferenceFromNow =
    latestDataDate && getDifferenceInCalendarDays(new Date(), latestDataDate);

  const timeAgo =
    latestDataDate && isDateToday(latestDataDate)
      ? i18n.t("today")
      : latestDataDate && isDateYesterday(latestDataDate)
      ? i18n.t("yesterday")
      : i18n.t("days_ago", { days: latestDataDifferenceFromNow });

  const price = currentLevel ? Math.round(1.62 * currentLevel) : 0;
  const buns = price ? Math.round(price / 20) : 0;

  const coTwo = ducky?.convert?.energy.electricity.co2e
    ? `${Math.round(ducky?.convert?.energy.electricity.co2e)}`
    : undefined;
  const translations = ducky?.translate || undefined;

  return {
    currentLevel: Math.round(currentLevel),
    timeAgo,
    price,
    buns,
    coTwo,
    translations
  };
};
