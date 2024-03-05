import { FC, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

import TextInput from "@/components/input/TextInput";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";

import { SchoolSettingsI } from "@/types/school";

interface SchoolSettingsFormProps {
  data: SchoolSettingsI;
}

type Inputs = SchoolSettingsI;

const SchoolSettingsForm: FC<SchoolSettingsFormProps> = ({ data }) => {
  const [t] = useTranslation();

  const [copySuccess, setCopySuccess] = useState(false);

  useLayoutEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 1500);
    }
  }, [copySuccess]);

  const defaultValues = data
    ? data
    : {
        logo_url: "",
        main_color: "",
        name: "",
        webhook_url: ""
      };

  const formMethods = useForm<Inputs>({
    defaultValues,
    reValidateMode: "onChange"
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  const { handleSubmit } = formMethods;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.webhook_url);
    setCopySuccess(true);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="lg:w-[560px] lg:px-12 lg:py-4">
          <h2 className="mb-2 text-lg font-medium">
            {t("school_settings_form.webhook")}
          </h2>
          <p className="mb-6 text-sm">
            {t("school_settings_form.webhook_note")}
          </p>
          <TextInput
            multiline
            readOnly
            name="webhook_url"
            label={t("school_settings_form.webhook")}
          />
          <Tooltip
            open={copySuccess}
            title={t("school_settings_form.copy_webhook_success")}
          >
            <Button onClick={handleCopy} className="mt-6">
              {t("school_settings_form.copy_webhook")}
            </Button>
          </Tooltip>
        </div>
      </form>
    </FormProvider>
  );
};

export default SchoolSettingsForm;
