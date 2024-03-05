import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "@/components/Icon";
import Chip from "@/components/Chip";
import IconButton from "@/components/IconButton";
import IntegrationSettings from "@/components/workspace/IntegrationSettings";
import IntegrationSimpleSettings from "@/components/workspace/IntegrationSimpleSettings";

import { getIntegrations } from "@/api/school";
import { Integration } from "@/types/school";

const Integrations = () => {
  const [t] = useTranslation();
  const matches = useMediaQuery("(min-width:1024px)");

  const { schoolId } = useParams<{ schoolId: string }>();

  const { data, refetch } = useQuery<Integration[]>({
    queryKey: ["integrations", schoolId],
    queryFn: () => getIntegrations({ schoolId })
  });

  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);

  const toggleIntegration = (integration: Integration) => {
    setSelectedIntegration((data) =>
      data?.key === integration.key ? null : integration
    );
  };

  const handleIntegrationAction = (id: number) => {
    refetch().then((res) => {
      if (res.data) {
        const updatedIntegration = res.data.find((item) => item.id === id);
        updatedIntegration && setSelectedIntegration(updatedIntegration);
      }
    });
  };

  const isHelsinborgWeather =
    selectedIntegration?.key === "weather_helsingborg";

  const isFootprintCalculator =
    selectedIntegration?.key === "footprint_calculator";

  return (
    <main className="w-full items-start gap-4 lg:flex">
      <div
        className={`shrink flex-grow overflow-hidden rounded-2xl bg-white  ${
          selectedIntegration ? "hidden lg:block" : ""
        }`}
      >
        <h1 className="p-4 text-[22px] font-medium">{t("integrations")}</h1>

        <List className=" p-0">
          {data?.map((integration) => (
            <ListItem
              key={integration.key}
              disablePadding
              className={`group border-b border-secondary last:border-b-0
              ${
                selectedIntegration?.key === integration.key
                  ? "bg-lime-300 hover:bg-lime-300"
                  : ""
              }`}
            >
              <ListItemButton
                aria-selected={selectedIntegration?.key === integration.key}
                className="gap-4 py-4 ring-inset ring-blue-500 focus-visible:ring-2 group-last:rounded-b-2xl"
                onClick={() => toggleIntegration(integration)}
              >
                <Icon className="shrink-0" name="integration" />
                <div className="flex-grow overflow-hidden">
                  <p className="truncate">{integration.name}</p>
                </div>
                <div className="w-24 shrink-0">
                  <Chip
                    label={t(
                      integration.school_integrations[0]?.status || "inactive"
                    )}
                    variant={
                      integration.school_integrations[0]?.status || "inactive"
                    }
                    onActiveSurface={
                      integration.key === selectedIntegration?.key
                        ? true
                        : false
                    }
                  />
                </div>
                <Icon
                  className="mr-1 shrink-0 2xl:ml-14"
                  name="arrow-right-large"
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      {selectedIntegration && (
        <div
          aria-live="polite"
          className="flex-grow overflow-hidden rounded-2xl bg-white lg:max-w-[428px]"
        >
          <div className="flex items-center gap-4 p-4 lg:p-6">
            {!matches && (
              <IconButton
                variant="grey"
                onClick={() => toggleIntegration(selectedIntegration)}
                a11y={t("a11y.back_to_integrations")}
                icon="arrow-left"
              />
            )}
            <div>
              {!matches && <p>{selectedIntegration.name}</p>}
              <h2 className="text-[22px] font-medium leading-7">
                {t("settings")}
              </h2>
            </div>
          </div>

          {!!selectedIntegration &&
          (isHelsinborgWeather || isFootprintCalculator) ? (
            <IntegrationSimpleSettings
              key={selectedIntegration.key}
              integration={selectedIntegration}
              schoolId={schoolId}
              handleIntegrationAction={handleIntegrationAction}
            />
          ) : (
            <IntegrationSettings
              key={selectedIntegration.key}
              integration={selectedIntegration}
              schoolId={schoolId}
              handleIntegrationAction={handleIntegrationAction}
            />
          )}
        </div>
      )}
    </main>
  );
};

export default Integrations;
