"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Fade,
  Stack,
} from "@mui/material";
import { useTheme, styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { fakeApi, Job } from "@/lib/fakeApi";
import ActionMenu from "@/components/ui/ActionMenu";
import { AddJobForm } from "@/components/ui/AddJobForm";


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

export default function JobsPage() {
  const theme = useTheme();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Job | undefined>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  
  useEffect(() => {
    setLoading(true);

    const localJobs =
      typeof window !== "undefined" ? localStorage.getItem("jobs") : null;

    if (localJobs) {
      const parsed = JSON.parse(localJobs);
      setJobs(parsed);
      setFilteredJobs(parsed);
      setLoading(false);
    } else {
      fakeApi.getJobs().then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        localStorage.setItem("jobs", JSON.stringify(data));
        setLoading(false);
      });
    }
  }, []);

 
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredJobs(jobs);
    } else {
      const lower = query.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(lower) ||
            j.customer.toLowerCase().includes(lower) ||
            j.repairShop.toLowerCase().includes(lower)
        )
      );
    }
    setPage(0);
  };

  
  const handleSortChange = (id: keyof Job) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...filteredJobs].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setFilteredJobs(sorted);
  };

  const columns: Column<Job>[] = [
    { id: "id", label: "Job ID", sortable: true },
    {
      id: "title",
      label: "Job Title",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={row.image} alt={row.title} />
          <Typography variant="body2">{row.title}</Typography>
        </Box>
      ),
    },
    { id: "customer", label: "Customer", sortable: true },
    { id: "assignedTo", label: "Assigned To", sortable: true },
    { id: "repairShop", label: "Repair Shop", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <ActionMenu
          id={row.id.toString()}
          type="job"
          onArchive={(id) => console.log("Archived job:", id)}
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
            Job Management
          </Typography>
          <AppButton variant="contained" onClick={() => setOpen(true)}>
            + Add Job
          </AppButton>
        </Stack>

        
        <Box mb={2} display="flex" justifyContent="flex-start">
          <SearchContainer>
            <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <StyledInputBase
              placeholder="Search by Title, Customer, or Repair Shop"
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

        {/* Table with fade & click transition */}
        <AppTable<Job>
          columns={columns}
          data={filteredJobs.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          loading={loading}
          total={filteredJobs.length}
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
              router.push(`/jobs/${row.id}`);
              element.style.opacity = "1";
            }, 300);
          }}
        />

        
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Job</DialogTitle>
          <DialogContent>
            <AddJobForm />
          </DialogContent>
          <DialogActions />
        </Dialog>
      </Box>
    </Fade>
  );
}
