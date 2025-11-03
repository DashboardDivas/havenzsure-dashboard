"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fakeApi, Job } from "@/lib/fakeApi";
import { AppButton } from "@/components/ui/Buttons";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  // ✏️ Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editedJob, setEditedJob] = useState<Job | null>(null);

  // Fetch job details
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      setLoading(true);

      // Load from localStorage first
      const localJobs =
        typeof window !== "undefined" ? localStorage.getItem("jobs") : null;
      let data: Job[] = [];

      if (localJobs) {
        data = JSON.parse(localJobs);
      } else {
        data = await fakeApi.getJobs();
        if (typeof window !== "undefined") {
          localStorage.setItem("jobs", JSON.stringify(data));
        }
      }

      if (!mounted) return;

      const found = data.find((j) => String(j.id) === String(id));
      setJob(found || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Open edit dialog
  const handleEditOpen = () => {
    if (!job) return;
    setEditedJob({ ...job });
    setOpenEdit(true);
  };

  // Handle field change
  const handleEditChange = (field: keyof Job, value: string) => {
    if (!editedJob) return;
    setEditedJob({ ...editedJob, [field]: value });
  };

  // Save job edits
  const handleSave = async () => {
    if (!editedJob) return;
    try {
      setLoading(true);
      const updated = await fakeApi.updateJob(editedJob);
      setJob(updated);
      setEditedJob(updated);
      setOpenEdit(false);
      console.log("✅ Job updated globally:", updated);
    } catch (err) {
      console.log("❌ Failed to update job:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error" mb={2}>
          Job not found.
        </Typography>
        <AppButton onClick={() => router.push("/jobs")}>Go Back</AppButton>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => router.push("/jobs")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Job Details
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}
      >
        {/* Top Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="h6" noWrap>
              {job.title}
            </Typography>
            <Typography color="text.secondary" noWrap>
              Customer: {job.customer}
            </Typography>
            <Chip
              label={job.status}
              color={
                job.status === "Completed"
                  ? "success"
                  : job.status === "In Progress"
                  ? "info"
                  : job.status === "Pending"
                  ? "warning"
                  : "default"
              }
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <AppButton variant="outlined" onClick={() => {}}>
              Contact
            </AppButton>
            <AppButton
              color="primary"
              variant="contained"
              onClick={handleEditOpen}
            >
              Edit Job
            </AppButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Job Info */}
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Job ID" secondary={job.id} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Customer" secondary={job.customer} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Assigned To" secondary={job.assignedTo} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Repair Shop" secondary={job.repairShop} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Status" secondary={job.status} />
          </ListItem>
        </List>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Job Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editedJob && (
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={editedJob.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
                fullWidth
              />
              <TextField
                label="Customer"
                value={editedJob.customer}
                onChange={(e) => handleEditChange("customer", e.target.value)}
                fullWidth
              />
              <TextField
                label="Assigned To"
                value={editedJob.assignedTo}
                onChange={(e) => handleEditChange("assignedTo", e.target.value)}
                fullWidth
              />
              <TextField
                label="Repair Shop"
                value={editedJob.repairShop}
                onChange={(e) => handleEditChange("repairShop", e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={editedJob.status}
                onChange={(e) => handleEditChange("status", e.target.value)}
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <AppButton variant="outlined" onClick={() => setOpenEdit(false)}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
