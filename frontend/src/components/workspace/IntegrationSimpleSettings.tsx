import { FC, useState } from "react";
import { Integration } from "@/types/school";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import Button from "@/components/Button";

import { updateIntegration, createIntegration } from "@/api/school";

interface IntegrationSimpleSettingsProps {
  integration: Integration;
  schoolId?: string;
  handleIntegrationAction: (id: number) => void;
}

const IntegrationSimpleSettings: FC<IntegrationSimpleSettingsProps> = ({
  integration,
  schoolId,
  handleIntegrationAction
}) => {
  const [t] = useTranslation();

  const update = useMutation({
    mutationFn: updateIntegration
  });
  const create = useMutation({
    mutationFn: createIntegration
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const schoolIntegration = integration.school_integrations[0];

  const isActive = schoolIntegration?.status === "active";

  const onSubmit = () => {
    !schoolIntegration
      ? create.mutate(
          {
            schoolId,
            integrationId: integration.id,
            settings: {}
          },
          {
            onSuccess: () => {
              setShowSuccess(true);
              handleIntegrationAction(integration.id);
            },
            onError: () => {
              setShowError(true);
            }
          }
        )
      : update.mutate(
          {
            integrationId: schoolIntegration.id,
            status: isActive ? "inactive" : "active",
            settings: {}
          },
          {
            onSuccess: () => {
              handleIntegrationAction(integration.id);
              !isActive ? setShowSuccess(true) : setShowSuccess(false);
            },
            onError: () => {
              setShowError(true);
            }
          }
        );
  };

  return (
    <div>
      {showSuccess && !showError && (
        <div className="mx-4 mb-0 mt-6 flex flex-col gap-2 rounded-2xl bg-lime-200 p-4 text-lime-800 md:mx-6">
          <h3 className="text-lg font-medium">{t("integration_active")}</h3>
          <p>
            {t("integration_simple_active_note", {
              integration: integration.name
            })}
          </p>
        </div>
      )}
      {!showSuccess && showError && (
        <div className="mx-4 mb-0 mt-6 flex flex-col gap-2 rounded-2xl bg-red-200 p-4 text-red-800 md:mx-6">
          <h3 className="text-lg font-medium">{t("error")}</h3>
          <p>{t("integration_error", { integration: integration.name })}</p>
        </div>
      )}
      {(!schoolIntegration || !isActive) && !showError && !showSuccess && (
        <p className="p-4 pb-0 md:p-6 md:pb-0">
          {t("integration_simple_empty", {
            integration: integration.name
          })}
        </p>
      )}
      <div className="flex justify-end px-4 py-6 ">
        <Button variant="primary" onClick={onSubmit}>
          {t(isActive ? "deactivate" : "activate")}
        </Button>
      </div>
    </div>
  );
};

export default IntegrationSimpleSettings;
