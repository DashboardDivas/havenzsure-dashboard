"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import { fakeApi, WorkOrder, User } from "@/lib/fakeApi";
import StatusChip from "@/components/ui/StatusChip";
import { Upload, Delete, CheckCircle, Repeat } from "@mui/icons-material";


export default function OverviewTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadWorkOrders() {
      setLoading(true);
      setUsers(await fakeApi.getUsers());
      const data = await fakeApi.getWorkOrders();
      setWorkOrder(data[0]);
      setLoading(false);
    }
    loadWorkOrders();
  }, []);

  const handleAssignClick = () => setAssignDialogOpen(true);

  const handleAssignUser = (user: User) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleAssignCancel = () => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
    setConfirmDialogOpen(false);
  };

  const handleConfirmYes = () => {
    setAssignDialogOpen(false);
    setConfirmDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmNo = () => {
    setConfirmDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!workOrder) {
    return (
      <Typography color="text.secondary" textAlign="center" mt={4}>
        No work order found.
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} p={2}>
      {/* Header */}
      <Box
        display="flex"
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Typography variant="h5" fontWeight={600}>
          Work Order Overview
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <AppButton
            variant="outlined"
            startIcon={<Repeat />}
            onClick={handleAssignClick}
          >
            Assign
          </AppButton>
          <AppButton variant="outlined" color="error" startIcon={<Delete />}>
            Delete
          </AppButton>
          <AppButton
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
          >
            Mark Completed
          </AppButton>
        </Box>
      </Box>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleAssignCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Work Order</DialogTitle>
        <DialogContent>
          <List>
            {users?.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleAssignUser(user)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={600}>{user.name}</Typography>
                      <Chip label={user.role} size="small" sx={{ ml: 1 }} />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Status: {user.status}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        Repair Shop: {user.repairShop}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmNo} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Assignment</DialogTitle>
        <DialogContent>
          <Typography>
            Assign work order to{" "}
            <strong>{selectedUser?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo}>No</Button>
          <Button onClick={handleConfirmYes} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Top Grid: Customer + Vehicle Info */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
      >
        {/* Customer Info */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Info
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                src={workOrder.customerAvatar}
                alt={workOrder.customer}
                sx={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography fontWeight={600}>{workOrder.customer}</Typography>
                <StatusChip status={workOrder.status} />
              </Box>
            </Box>
            <Info label="Phone" value={workOrder.phone} />
            <Info label="Email" value={workOrder.email} />
            <Info label="Address" value={workOrder.address} />
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Vehicle Info
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Info label="Plate" value={workOrder.plate} />
            <Info label="Make" value={workOrder.make} />
            <Info label="Model" value={workOrder.model} />
          </CardContent>
        </Card>
      </Box>

      {/* Middle Grid: Media + AI Scan and Dent Details */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
      >
        {/* Media & AI Scan + AI Result */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Media & AI Scan
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                <AppButton variant="outlined" startIcon={<Upload />}>
                  Upload Photos
                </AppButton>
                <AppButton variant="outlined" startIcon={<Upload />}>
                  Upload AI Scan
                </AppButton>
                <AppButton variant="contained">Trigger AI Scan</AppButton>
              </Box>
            </CardContent>
          </Card>

          {/* AI Result */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">AI Result</Typography>
                <StatusChip status="completed" />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="AI Result Preview"
                  sx={{
                    width: 100,
                    height: 70,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
                <Box flexGrow={1}>
                  <Typography variant="body1" fontWeight={600}>
                    Detected Damage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    3 dents detected — Confidence: 94%
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Box>

        {/* Dent Details */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dent Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell align="right">Estimate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workOrder.dents?.length ? (
                  workOrder.dents.map((dent, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{dent.location}</TableCell>
                      <TableCell>{dent.severity}</TableCell>
                      <TableCell align="right">
                        ${dent.estimate.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No dent data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

/** Small helper component for consistent label/value rendering */
const Info = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <Box display="flex" mb={1}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ minWidth: 90, fontWeight: 500 }}
    >
      {label}:
    </Typography>
    <Typography variant="body2" color="text.primary">
      {value || "—"}
    </Typography>
  </Box>
);
