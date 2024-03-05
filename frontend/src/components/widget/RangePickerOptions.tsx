import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonBase } from "@mui/material";

import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface RangePickerProps {
  onSubmit: (range: string) => void;
  onCancel: () => void;
  range: string;
  rangeOptions: {
    key: string;
    label: string;
    range: { from: string; to: string };
  }[];
}

const RangePicker: FC<RangePickerProps> = ({
  onSubmit,
  onCancel,
  rangeOptions,
  range
}) => {
  const [t] = useTranslation();

  const [selected, setSelected] = useState(range);

  const selectRange = (range: string) => setSelected(range);

  const onApply = () => {
    onCancel();
    onSubmit(selected);
  };

  return (
    <div>
      <ul>
        {rangeOptions.map(({ key, label }) => (
          <li className="group" key={key}>
            <ButtonBase
              aria-selected={selected === key}
              className="flex h-12 w-full items-center justify-start gap-4 overflow-hidden bg-grey-200 pl-4 pr-6 text-grey-400 ring-inset ring-blue-500 focus-visible:ring-2 group-first:rounded-t-2xl group-last:rounded-b-2xl"
              onClick={() => selectRange(key)}
            >
              <span className="w-6">
                {selected === key ? <Icon name="check" /> : null}
              </span>
              {label}
            </ButtonBase>
          </li>
        ))}
      </ul>
      <div className="-mx-4 flex justify-end gap-2 pb-2 pt-6">
        <Button variant="transparent" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button variant="primary" onClick={onApply}>
          {t("apply")}
        </Button>
      </div>
    </div>
  );
};

export default RangePicker;
