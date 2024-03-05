import { FC, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import svDateLocale from "date-fns/locale/sv";
import enDateLocale from "date-fns/locale/en-GB";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { isExistingDate } from "@/utils/helpers";

interface DatePickerProps {
  name: string;
  label: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  required?: boolean;
  syncedLabel?: string;
}

const DatePicker: FC<DatePickerProps> = ({
  label,
  name,
  minDate,
  maxDate,
  syncedLabel,
  required = false
}) => {
  const [t] = useTranslation();
  const [error, setInputError] = useState<string>();

  const {
    control,
    formState: { errors },
    setError,
    clearErrors
  } = useFormContext();

  const locale =
    (localStorage.getItem("antiloop_locale") === "en" && enDateLocale) ||
    svDateLocale;

  const customError = errors[name]?.message;

  useEffect(() => {
    setInputError(customError as string);
  }, [customError]);

  const setErrors = (error?: string) => {
    setInputError(error);
    setError(name, {
      type: "custom",
      message: error
    });
  };

  const handleError = (error: string | null) => {
    if (error === "disableFuture") {
      setErrors(t("date_picker.future"));
    } else if (error === "invalidDate") {
      setErrors(t("date_picker.invalid"));
    } else if (error === "minDate") {
      minDate &&
        isExistingDate(minDate) &&
        setErrors(t("date_picker.min", { label: syncedLabel }));
    } else if (error === "maxDate") {
      maxDate &&
        isExistingDate(maxDate) &&
        setErrors(t("date_picker.max", { label: syncedLabel }));
    } else {
      setInputError(undefined);
      clearErrors(name);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider
          adapterLocale={locale}
          dateAdapter={AdapterDateFns}
        >
          <MuiDatePicker
            minDate={minDate}
            maxDate={maxDate}
            value={field.value}
            onError={(newError) => handleError(newError)}
            format="dd.MM.yyyy"
            disableFuture
            onChange={(newValue, context) => {
              handleError(context.validationError);
              return field.onChange(newValue);
            }}
            slotProps={{
              desktopPaper: {
                className: "rounded-xl mt-2"
              },
              mobilePaper: {
                className: "rounded-xl mt-2"
              },
              textField: {
                required: required,
                fullWidth: true,
                variant: "filled",
                label,
                name,
                error: !!error,
                helperText: error ? error : null,
                FormHelperTextProps: {
                  className: error ? "!text-red-500" : ""
                },
                InputLabelProps: {
                  className: error ? "!text-red-500" : ""
                },
                InputProps: {
                  autoComplete: "off",
                  className: `rounded-t-xl ${
                    error
                      ? "before:!border-b-red-500 after:!border-b-red-500"
                      : ""
                  }`
                }
              }
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default DatePicker;
