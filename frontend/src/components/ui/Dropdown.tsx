"use client";

import React from "react";
import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type DropdownOption = { label: string; value: string | number };

interface AppDropdownProps extends Omit<SelectProps, "onChange"> {
  label?: string;
  options: DropdownOption[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export default function AppDropdown({
  label,
  options,
  value,
  onChange,
  ...props
}: AppDropdownProps) {
  const theme = useTheme();

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 180,
        "& .MuiOutlinedInput-root": {
          borderRadius: theme.shape.borderRadius,
        },
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...props}
        value={value}
        onChange={(event) => onChange((event.target as HTMLInputElement).value as string | number)}
        label={label}
        sx={{
          color: theme.palette.text.primary,
          "& .MuiSelect-icon": {
            color: theme.palette.text.secondary,
          },
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
