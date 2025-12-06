"use client";

import React from "react";
import { Box, InputBase } from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AppDropdown from "@/components/ui/Dropdown";
import { AppButton } from "@/components/ui/Buttons";

type FilterOption = "workOrder" | "customer";

interface SearchBarProps {
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
}

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: typeof theme.shape.borderRadius === "number"
    ? theme.shape.borderRadius * 5
    : 20, // fallback to a default value if not a number
  padding: theme.spacing(0.5),
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.05)
      : alpha(theme.palette.common.black, 0.05),
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: 700,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2, 1, 1),
  },
}));

export default function SearchBar({
  filter,
  setFilter,
  query,
  setQuery,
  onSearch,
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <SearchContainer>
      <AppDropdown
        value={filter}
        onChange={(val) => setFilter(val as FilterOption)}
        options={[
          { label: "Work Order Code", value: "workOrder" },
          { label: "Customer Name", value: "customer" },
        ]}
        sx={{
          minWidth: 150,
          "& .MuiOutlinedInput-root": { border: "none" },
        }}
      />

      <SearchIcon sx={{ color: theme.palette.text.secondary, mx: 1 }} />

      <StyledInputBase
        placeholder={
          filter === "workOrder"
            ? "Search by Work Order Code…"
            : "Search by Customer Name…"
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />

      {/* ✅ Search button INSIDE the bar */}
      <AppButton
        variant="contained"
        onClick={onSearch}
        startIcon={<SearchIcon />}
        sx={{
          borderRadius: "9999px",
          ml: 1,
          whiteSpace: "nowrap",
        }}
      >
        Search
      </AppButton>
    </SearchContainer>
  );
}
