"use client";

import React, { useState } from "react";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OverviewTab from "./OverviewTab";
import AIScanTab from "./AIScanTab";
import ClaimTab from "./ClaimTab";
import QuoteTab from "./QuoteTab";
import LogTab from "./LogTab";
import PaymentTab from "./PaymentTab";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import PaymentIcon from "@mui/icons-material/Payment";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";


export default function WorkOrderPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { value: "overview", label: "Overview", icon: <VisibilityIcon fontSize="small" /> },
    { value: "aiscan", label: "AI Scan", icon: <SmartToyIcon fontSize="small" /> },
    { value: "quote", label: "Quote", icon: <RequestQuoteIcon fontSize="small" /> },
    { value: "claim", label: "Claim", icon: <AssignmentIcon fontSize="small" /> },
    { value: "log", label: "Log", icon: <HistoryIcon fontSize="small" /> },
    { value: "payment", label: "Payment", icon: <PaymentIcon fontSize="small" /> },
  ];

  return (
    <Box p={3}>
      {/* Tab Bar (static, scrolls with page) */}
      <Box
        mb={3}
        sx={{
          borderRadius: 3,
          p: 1.5,
          backdropFilter: "blur(12px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.8)"
              : "rgba(30,30,30,0.6)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 4px 12px rgba(0,0,0,0.08)"
              : "0 4px 16px rgba(0,0,0,0.4)",
          border: `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.08)"
              : "rgba(255,255,255,0.1)"
          }`,
        }}
      >
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={(_, val) => val && setActiveTab(val)}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 1.5,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              borderRadius: "12px",
              px: 2,
              py: 0.8,
              fontWeight: 500,
              fontSize: "0.85rem",
              transition: "all 0.2s ease-in-out",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.7,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[800],
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 2px 8px rgba(0,0,0,0.15)"
                    : "0 2px 10px rgba(0,0,0,0.6)",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            },
          }}
        >
          {tabs.map((tab) => (
            <ToggleButton key={tab.value} value={tab.value}>
              {tab.icon} {tab.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "aiscan" && <AIScanTab />}
        {activeTab === "claim" && <ClaimTab />}
        {activeTab === "quote" && <QuoteTab />}
        {activeTab === "log" && <LogTab />}
        {activeTab === "payment" && <PaymentTab />}
      </Box>
    </Box>
  );
}
