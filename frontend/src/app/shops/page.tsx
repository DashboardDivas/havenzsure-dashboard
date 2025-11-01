"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  InputBase,
  Fade,
  Stack,
  IconButton,
} from "@mui/material";
import { useTheme, styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close"; // <-- added
import { useRouter } from "next/navigation";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { shopApi, Shop } from "@/lib/api/shopApi"; // ✅ UPDATED
import { AddShopForm } from "@/components/ui/AddShopForm";
import ActionMenu from "@/components/ui/ActionMenu";

// 🔍 Styled components
const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 3
      : 12,
  padding: theme.spacing(0.5, 1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.05)
      : alpha(theme.palette.common.black, 0.05),
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: 400,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default function ShopsPage() {
  const theme = useTheme();
  const router = useRouter();

  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Shop | undefined>("code");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 🧩 Fetch data from real API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await shopApi.getShops();
        setShops(data);
        setFilteredShops(data);
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔍 Handle search
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredShops(shops);
    } else {
      const lower = query.toLowerCase();
      setFilteredShops(
        shops.filter(
          (s) =>
            s.shopName.toLowerCase().includes(lower) ||
            s.code.toLowerCase().includes(lower) ||
            s.address.toLowerCase().includes(lower)
        )
      );
    }
    setPage(0);
  };

  // Run search automatically when query or shops change so the summary reflects real results
  React.useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, shops]);

  // ❌ Clear search handler
  const handleClearSearch = () => {
    setQuery("");
    setFilteredShops(shops);
    setPage(0);
    // immediate visual feedback is provided by state updates (re-render)
  };

  // 🔄 Sorting logic
  const handleSortChange = (id: keyof Shop) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...filteredShops].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setFilteredShops(sorted);
  };

  // 🧱 Table columns
  const columns: Column<Shop>[] = [
    { id: "code", label: "Shop Code", sortable: true },
    { id: "shopName", label: "Shop Name", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    { id: "address", label: "Address", sortable: true },
    { id: "postalCode", label: "Postal Code", sortable: true },
    { id: "contactName", label: "Contact Name", sortable: true },
    { id: "phone", label: "Phone", sortable: true },
    { id: "email", label: "Email", sortable: true },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <ActionMenu
          id={row.code} // ✅ Use code instead of id.replace
          type="shop"
          onArchive={(id) => console.log("Archived shop:", id)}
        />
      ),
    },
  ];

  return (
    <Fade in timeout={400}>
      <Box p={3}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={600}>
            Shops Overview
          </Typography>
          <AppButton variant="contained" onClick={() => setOpen(true)}>
            + Add New Shop
          </AppButton>
        </Stack>

        {/* Search Bar */}
        <Box mb={2} display="flex" justifyContent="flex-start">
          <SearchContainer>
            <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <StyledInputBase
              placeholder="Enter Shop Name, Code, or Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <AppButton
              variant="contained"
              size="small"
              onClick={handleSearch}
              sx={{ ml: 1, borderRadius: "9999px" }}
            >
              Search
            </AppButton>
          </SearchContainer>
        </Box>

        {/* --- New: Search results summary + Clear button (shows when a query is active) --- */}
        {query.trim() !== "" && (
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1,
              p: 1,
              border: `1px solid ${theme.palette.divider}`,
              width: "100%",
              maxWidth: 700,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Found {filteredShops.length} shop{filteredShops.length !== 1 ? "s" : ""} matching "{query}"
            </Typography>
            <IconButton
              size="small"
              aria-label="Clear search"
              onClick={handleClearSearch}
              sx={{
                ml: 1,
                borderRadius: "9999px",
                backgroundColor: "transparent",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Table */}
        <AppTable<Shop>
          columns={columns}
          data={filteredShops.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          loading={loading}
          total={filteredShops.length}
          page={page}
          rowsPerPage={rowsPerPage}
          orderBy={orderBy}
          order={order}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onSortChange={handleSortChange}
          onRowClick={(row) => {
            const element = document.body;
            element.style.transition = "opacity 0.3s ease";
            element.style.opacity = "0.3";
            setTimeout(() => {
              router.push(`/shops/${row.code}`); // ✅ Navigate by code
              element.style.opacity = "1";
            }, 300);
          }}
        />

        {/* Add Shop Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <AddShopForm />
        </Dialog>
      </Box>
    </Fade>
  );
}
