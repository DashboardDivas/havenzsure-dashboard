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
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { shopApi, Shop } from "@/lib/api/shopApi";
import { AddShopForm } from "@/components/ui/AddShopForm";
import ActionMenu from "@/components/ui/ActionMenu";

// Styled components
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
  maxWidth: 500,
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
  const [orderBy, setOrderBy] = useState<keyof Shop | undefined>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch data from backend
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

  // Handle live search
  useEffect(() => {
    if (!query.trim()) {
      setFilteredShops(shops);
      setPage(0);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = shops.filter(
      (s) =>
        s.shopName.toLowerCase().includes(lower) ||
        s.code.toLowerCase().includes(lower) ||
        s.address.toLowerCase().includes(lower)
    );
    setFilteredShops(filtered);
    setPage(0);
  }, [query, shops]);

  //  Sorting logic
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

  //  Highlight helper
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} style={{ backgroundColor: "#ffe58f" }}>
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Table columns
  const columns: Column<Shop>[] = [
    { id: "id", label: "Shop ID", sortable: true },
    { id: "shopName", label: "Shop Name", sortable: true, render: (row) => highlightMatch(row.shopName, query) },
    { id: "status", label: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    { id: "address", label: "Address", sortable: true, render: (row) => highlightMatch(row.address, query) },
    { id: "postalCode", label: "Postal Code", sortable: true },
    { id: "contactName", label: "Contact Name", sortable: true },
    { id: "phone", label: "Phone", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "code", label: "Code", sortable: true, render: (row) => highlightMatch(row.code, query) },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <ActionMenu
          id={row.code}
          type="shop"
          onArchive={(id) => console.log("Archived shop:", id)}
        />
      ),
    },
  ];

  const handleClear = () => setQuery("");

  return (
    <Fade in timeout={400}>
      <Box p={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={600}>Shops Overview</Typography>
          <AppButton variant="contained" onClick={() => setOpen(true)}>+ Add New Shop</AppButton>
        </Stack>

        {/* Search Bar */}
        <Box mb={2} display="flex" flexDirection="column" gap={1}>
          <SearchContainer>
            <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <StyledInputBase
              placeholder="Enter Shop Name, Code, or Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            )}
          </SearchContainer>

          {/* Found X shops text */}
          {query && (
            <Typography variant="body2" color="text.secondary">
              Found {filteredShops.length} shop{filteredShops.length !== 1 ? "s" : ""} matching "{query}"
            </Typography>
          )}
        </Box>

        {/* Table */}
        <AppTable<Shop>
          columns={columns}
          data={filteredShops.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
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
              router.push(`/shops/${row.code}`);
              element.style.opacity = "1";
            }, 300);
          }}
        />

        {/* Add Shop Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Shop</DialogTitle>
          <AddShopForm />
          <DialogActions />
        </Dialog>
      </Box>
    </Fade>
  );
}
