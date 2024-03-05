import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import TextField from "@mui/material/TextField";

interface TextInputProps {
  required?: boolean | string;
  label: string;
  name: string;
  multiline?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  helperText?: string;
}

const TextInput: FC<TextInputProps> = ({
  required,
  label,
  name,
  multiline,
  disabled,
  helperText,
  readOnly
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const error = !!errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required
      }}
      render={({ field }) => (
        <TextField
          {...field}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          id={name}
          type="text"
          label={label}
          required={!!required}
          disabled={disabled}
          multiline={multiline}
          variant="filled"
          error={error}
          helperText={helperText}
          fullWidth
          InputLabelProps={{
            className: error ? "!text-red-500" : ""
          }}
          InputProps={{
            readOnly: readOnly,
            autoComplete: "off",
            className: `rounded-t-xl
            ${readOnly ? "!bg-grey-100" : ""}
            ${error ? "before:!border-b-red-500 after:!border-b-red-500" : ""}`
          }}
        />
      )}
    />
  );
};
export default TextInput;
