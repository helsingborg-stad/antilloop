import { useState } from "react";

import WidgetSection from "@/components/WidgetSection";
import PlantMoisture from "@/components/widget/plantMoisture/PlantMoisture";
import FoodWaste from "@/components/widget/foodWaste/FoodWaste";
import OutsideTemperature from "@/components/widget/outsideTemperature/OutsideTemperature";
import InsideTemperature from "@/components/widget/insideTemperature/InsideTemperature";
import Particles25 from "@/components/widget/particles25/Particles";
import Particles100 from "@/components/widget/particles100/Particles";
import CO2 from "@/components/widget/co2/CO2";
import SoundLevel from "@/components/widget/sound/SoundLevel";
import Weather from "@/components/widget/weather/Weather";
import Electricity from "@/components/widget/electricity/Electricity";

const WidgetExamples = () => {
  const [widget, setWidget] = useState("Food waste");

  const widgets = [
    "Food waste",
    "Soil moisture",
    "Outside temperature",
    "Inside temperature",
    "Particles 2.5",
    "Particles 10",
    "CO2",
    "Sound level",
    "Weather",
    "Electricity"
  ];

  const handleClick = (widget: string) => {
    setWidget(widget);
  };

  const duckyExample = {
    convert: {
      energy: {
        electricity: {
          co2e: 133.609
        }
      }
    },
    translate: {
      car: [
        {
          unit: "km",
          value: 456.62100456621005,
          translation: {
            unit: "km",
            vehicle: "gasoline_car",
            destinationA: "London",
            destinationB: "Glasgow",
            actualDistance: 403
          }
        },
        {
          unit: "km",
          value: 456.62100456621005,
          translation: {
            unit: "km",
            vehicle: "gasoline_car",
            destinationA: "London",
            destinationB: "Paris",
            actualDistance: 464
          }
        }
      ],
      tree: {
        unit: "m2 per year",
        value: 2040.816326530612
      },
      plane: [
        {
          unit: "km",
          value: 352.11267605633805,
          translation: {
            unit: "km",
            flightType: "local_flight",
            destinationA: "Oslo",
            destinationB: "Trondheim",
            actualDistance: 391
          }
        },
        {
          unit: "km",
          value: 352.11267605633805,
          translation: {
            unit: "km",
            flightType: "local_flight",
            destinationA: "Oslo",
            destinationB: "Stockholm",
            actualDistance: 416
          }
        },
        {
          unit: "km",
          value: 352.11267605633805,
          translation: {
            unit: "km",
            flightType: "local_flight",
            destinationA: "Paris",
            destinationB: "Geneva",
            actualDistance: 410
          }
        }
      ],
      energy: [
        {
          unit: "kWh",
          value: 318.47133757961785,
          translation: {
            quantity: 1.04,
            appliance: "bærbar PC",
            applianceUnit: "years"
          }
        },
        {
          unit: "kWh",
          value: 318.47133757961785,
          translation: {
            quantity: 2.72,
            appliance: "stasjonær PC",
            applianceUnit: "months"
          }
        },
        {
          unit: "kWh",
          value: 318.47133757961785,
          translation: {
            quantity: 6.42,
            appliance: "husholdnings energiforbruk",
            applianceUnit: "days"
          }
        }
      ]
    }
  };

  return (
    <main className="pt-[56px] sm:pt-[72px] ">
      <div className="mx-auto flex flex-wrap justify-center gap-4">
        {widgets.map((item) => (
          <button
            key={item}
            className={`rounded-32  px-6 py-4 ${
              item === widget ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {widget === "Food waste" && (
        <WidgetSection>
          <FoodWaste
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-28T00:00:00Z",
              waste_in_g: 1500,
              waste_in_g_per_person: 5,
              attendees_count: 200
            }}
          />
          <FoodWaste
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-28T00:00:00Z",
              waste_in_g: 4500,
              waste_in_g_per_person: 15,
              attendees_count: 400
            }}
          />
          <FoodWaste
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-28T00:00:00Z",
              waste_in_g: 10500,
              waste_in_g_per_person: 35,
              attendees_count: 200
            }}
          />
          <FoodWaste
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-28T00:00:00Z",
              waste_in_g: null,
              waste_in_g_per_person: null,
              attendees_count: null
            }}
          />
        </WidgetSection>
      )}

      {widget === "Soil moisture" && (
        <WidgetSection>
          <PlantMoisture id={1} quickLinkId={""} currentTestLevel={10} />
          <PlantMoisture id={1} quickLinkId={""} currentTestLevel={30} />
          <PlantMoisture id={1} quickLinkId={""} currentTestLevel={70} />
          <PlantMoisture id={1} quickLinkId={""} currentTestLevel={null} />
          <PlantMoisture id={1} quickLinkId={""} img currentTestLevel={10} />
          <PlantMoisture id={1} quickLinkId={""} img currentTestLevel={30} />
          <PlantMoisture id={1} quickLinkId={""} img currentTestLevel={70} />
          <PlantMoisture id={1} quickLinkId={""} img currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Outside temperature" && (
        <WidgetSection>
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={-30} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={-20} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={-5} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={5} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={17} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={26} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={37} />
          <OutsideTemperature id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Inside temperature" && (
        <WidgetSection>
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={10} />
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={17} />
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={22} />
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={26} />
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={32} />
          <InsideTemperature id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Particles 2.5" && (
        <WidgetSection>
          <Particles25 id={1} quickLinkId={""} currentTestLevel={8.22} />
          <Particles25 id={1} quickLinkId={""} currentTestLevel={14.45} />
          <Particles25 id={1} quickLinkId={""} currentTestLevel={24.66} />
          <Particles25 id={1} quickLinkId={""} currentTestLevel={30} />
          <Particles25 id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Particles 10" && (
        <WidgetSection>
          <Particles100 id={1} quickLinkId={""} currentTestLevel={29.1} />
          <Particles100 id={1} quickLinkId={""} currentTestLevel={49} />
          <Particles100 id={1} quickLinkId={""} currentTestLevel={70.22} />
          <Particles100 id={1} quickLinkId={""} currentTestLevel={110} />
          <Particles100 id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "CO2" && (
        <WidgetSection>
          <CO2 id={1} quickLinkId={""} currentTestLevel={200} />
          <CO2 id={1} quickLinkId={""} currentTestLevel={500} />
          <CO2 id={1} quickLinkId={""} currentTestLevel={700} />
          <CO2 id={1} quickLinkId={""} currentTestLevel={900} />
          <CO2 id={1} quickLinkId={""} currentTestLevel={1200} />
          <CO2 id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Sound level" && (
        <WidgetSection>
          <SoundLevel id={1} quickLinkId={""} currentTestLevel={45} />
          <SoundLevel id={1} quickLinkId={""} currentTestLevel={62} />
          <SoundLevel id={1} quickLinkId={""} currentTestLevel={85} />
          <SoundLevel id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
      {widget === "Weather" && (
        <WidgetSection>
          <Weather quickLinkId={""} />
        </WidgetSection>
      )}
      {widget === "Electricity" && (
        <WidgetSection>
          <Electricity
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-21T00:00:00Z",
              kwh: 100.55,
              duckyExample: duckyExample
            }}
          />
          <Electricity
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-21T00:00:00Z",
              kwh: 500,
              duckyExample: duckyExample
            }}
          />
          <Electricity
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-21T00:00:00Z",
              kwh: 780,
              duckyExample: duckyExample
            }}
          />
          <Electricity
            id={1}
            quickLinkId={""}
            currentTestLevel={{
              date: "2023-08-21T00:00:00Z",
              kwh: 4000,
              duckyExample: duckyExample
            }}
          />
          <Electricity id={1} quickLinkId={""} currentTestLevel={null} />
        </WidgetSection>
      )}
    </main>
  );
};

export default WidgetExamples;
