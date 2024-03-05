import { FC, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import DatePicker from "@/components/input/DatePicker";

import {
  substractTime,
  addTime,
  isExistingDate,
  getDifferenceInMonths
} from "@/utils/helpers";

interface RangePickerProps {
  onSubmit: (data: { from: Date | null; to: Date | null }) => void;
  onCancel: () => void;
  range: { from: string; to: string };
  rangeUpdated: boolean;
  maxRange?: "week" | "year";
}

type Inputs = {
  from: Date | null;
  to: Date | null;
};

const RangePicker: FC<RangePickerProps> = ({
  onSubmit,
  onCancel,
  range,
  rangeUpdated,
  maxRange
}) => {
  const [t] = useTranslation();

  const defaultValues = {
    from: rangeUpdated ? new Date(range.from) : null,
    to: rangeUpdated ? new Date(range.to) : null
  };

  const formMethods = useForm<Inputs>({
    defaultValues,
    reValidateMode: "onChange"
  });

  const onFormSubmit: SubmitHandler<Inputs> = (data) => {
    onSubmit(data);
  };

  const {
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = formMethods;

  const submitDisabled = Object.keys(errors).length > 0;

  const toValue = watch("to") || null;
  const fromValue = watch("from") || null;

  const minFromDate = toValue
    ? maxRange === "week"
      ? isExistingDate(toValue)
        ? substractTime(toValue, { days: 6 })
        : null
      : maxRange === "year"
      ? isExistingDate(toValue)
        ? substractTime(toValue, { years: 1 })
        : null
      : null
    : null;

  const maxToDate = fromValue
    ? maxRange === "week"
      ? isExistingDate(fromValue)
        ? addTime(fromValue, { days: 6 })
        : null
      : maxRange === "year"
      ? isExistingDate(fromValue)
        ? addTime(fromValue, { years: 1 })
        : null
      : null
    : null;

  useEffect(() => {
    const diff =
      fromValue && toValue && getDifferenceInMonths(toValue, fromValue);

    if (diff && diff > 12) {
      setError("from", {
        type: "custom",
        message: t("date_picker.year_range")
      });
      setError("to", {
        type: "custom",
        message: t("date_picker.year_range")
      });
    }
  }, [toValue, fromValue, setError, t]);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col gap-4 pb-8">
          <DatePicker
            required
            name="from"
            maxDate={toValue}
            minDate={minFromDate}
            label={t("start_date")}
            syncedLabel={t("end_date")}
          />
          <DatePicker
            required
            name="to"
            minDate={fromValue}
            maxDate={maxToDate}
            label={t("end_date")}
            syncedLabel={t("start_date")}
          />
        </div>
        <div className="-mx-4 flex justify-end gap-2 pb-2 pt-6">
          <Button variant="transparent" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button disabled={submitDisabled} variant="primary" type="submit">
            {t("apply")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RangePicker;
