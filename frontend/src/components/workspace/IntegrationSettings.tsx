import { FC, useState, useMemo } from "react";
import { Integration } from "@/types/school";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import CircularProgress from "@mui/material/CircularProgress";

import TextInput from "@/components/input/TextInput";
import Button from "@/components/Button";

import { updateIntegration, createIntegration } from "@/api/school";

interface IntegrationSettings {
  integration: Integration;
  schoolId?: string;
  handleIntegrationAction: (id: number) => void;
}

type Inputs = Integration["settings"];

const IntegrationSettings: FC<IntegrationSettings> = ({
  integration,
  schoolId,
  handleIntegrationAction
}) => {
  const [t] = useTranslation();

  const { mutate: update, isLoading: updateLoading } = useMutation({
    mutationFn: updateIntegration
  });
  const { mutate: create, isLoading: createLoading } = useMutation({
    mutationFn: createIntegration
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const initialDefaultValues = useMemo(() => {
    return Object.keys(integration?.settings).map((key) => ({ [key]: "" }));
  }, [integration?.settings]);

  const schoolIntegration = integration.school_integrations[0];

  const defaultValues = schoolIntegration?.settings || initialDefaultValues;

  const allFieldsFilled = useMemo(() => {
    return !Object.values(defaultValues).includes("" || null || undefined);
  }, [defaultValues]);

  const isActive = schoolIntegration?.status === "active";

  const formMethods = useForm<Inputs>({
    defaultValues,
    reValidateMode: "onChange"
  });

  const { handleSubmit, setError } = formMethods;

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    !schoolIntegration
      ? create(
          {
            schoolId,
            integrationId: integration.id,
            settings: { ...data }
          },
          {
            onSuccess: () => {
              setShowSuccess(true);
              handleIntegrationAction(integration.id);
              setShowError(false);
            },
            onError: () => {
              setShowError(true);
              setShowSuccess(false);
              const keys = Object.keys(defaultValues);

              keys.forEach((key: any) => {
                setError(key, {
                  type: "custom",
                  message: ""
                });
              });
            }
          }
        )
      : update(
          {
            integrationId: schoolIntegration.id,
            status: isActive ? "inactive" : "active",
            settings: { ...data }
          },
          {
            onSuccess: () => {
              handleIntegrationAction(integration.id);
              !isActive ? setShowSuccess(true) : setShowSuccess(false);
              setShowError(false);
            },
            onError: () => {
              setShowError(true);
              setShowSuccess(false);
              const keys = Object.keys(defaultValues);

              keys.forEach((key: any) => {
                setError(key, {
                  type: "custom",
                  message: ""
                });
              });
            }
          }
        );
  };

  const Inputs = integration
    ? Object.keys(integration?.settings).map((key) => (
        <TextInput required={true} label={key} name={key} />
      ))
    : [];

  return (
    <div className="relative">
      {createLoading || updateLoading ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-white/50">
          <CircularProgress />
        </div>
      ) : null}
      {showSuccess && !showError && (
        <div className="mx-4 mb-0 mt-6 flex flex-col gap-2 rounded-2xl bg-lime-200 p-4 text-lime-800 md:mx-6">
          <h3 className="text-lg font-medium">{t("integration_active")}</h3>
          <p>
            {t("integration_active_note", { integration: integration.name })}
          </p>
        </div>
      )}
      {showError && !showSuccess && (
        <div className="mx-4 mb-0 mt-6 flex flex-col gap-2 rounded-2xl bg-red-200 p-4 text-red-800 md:mx-6">
          <h3 className="text-lg font-medium">{t("error")}</h3>
          <p>{t("integration_error", { integration: integration.name })}</p>
        </div>
      )}
      {(!schoolIntegration || !allFieldsFilled) &&
        !showError &&
        !showSuccess && (
          <p className="p-4 pb-0 md:p-6 md:pb-0">
            {t("integration_empty", {
              integration: integration.name
            })}
          </p>
        )}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 px-4 pt-6 md:px-6">
            {...Inputs}
          </div>

          <div className="flex justify-end px-4 py-6 ">
            <Button variant="primary" type="submit">
              {t(isActive ? "deactivate" : "activate")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default IntegrationSettings;
