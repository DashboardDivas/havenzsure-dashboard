// /**
//  * DashboardPage.tsx
//  * 
//  * This file was generated with the help of ChatGPT.
//  * 
//  * Description:
//  * A modern claims management dashboard for insurance work orders.
//  * It displays analytics (charts, KPIs, claim stats), a sortable table of recent work orders,
//  * and includes functionality for creating, viewing, and deleting work orders using
//  * dynamic forms and Material UI components.
//  * 
//  * Prompt Summary:
//  * "Create a React-based insurance claims dashboard page in Next.js using Material UI and Recharts.
//  * Include analytics, charts, and a data table with add/edit/delete actions for work orders.
//  * The AddWorkOrderForm should load dynamically, and everything should be client-side only."
//  */

"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {Box, Container, Card, CardContent, Typography, Chip, Avatar,Tabs,Tab, Snackbar,Alert,IconButton,Menu,MenuItem,Dialog,DialogTitle, DialogContent,} from "@mui/material";
import {Add,Description,Download,MoreVert,Visibility,Edit,Delete,} from "@mui/icons-material";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import CustomThemeProvider from "@/context/ThemeContext";


type WorkOrderStatus = "approved" | "pending" | "rejected" | "review";
type WorkOrderPriority = "high" | "medium" | "low";

export type WorkOrder = {
  id: string;
  claimant: string;
  type: string;
  amount: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignee: string;
  date: string;
};

export interface AddWorkOrderFormValues {
  claimant?: string;
  firstName?: string;
  lastName?: string;
  claimType?: string;
  type?: string;
  amount?: number | string;
  amountFormatted?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assignee?: string;
}

interface AddWorkOrderFormProps {
  onSubmit: (values: AddWorkOrderFormValues) => void;
  onCancel: () => void;
}


const AddWorkOrderForm = dynamic<AddWorkOrderFormProps>(
  () => import("@/components/ui/AddWorkOrderForm").then((mod) => mod.WorkOrderForm as React.ComponentType<AddWorkOrderFormProps>),
  { 
    ssr: false,
    loading: () => <div>Loading form...</div> // Add loading state
  }
);


const metrics = [
  { title: "Total Claims", value: "1,284", change: "+12.5%", trend: "up", color: "#2196f3" },
  { title: "Pending Review", value: "142", change: "-8.2%", trend: "down", color: "#ff9800" },
  { title: "Approved", value: "896", change: "+15.3%", trend: "up", color: "#4caf50" },
  { title: "Rejected", value: "246", change: "-3.1%", trend: "down", color: "#f44336" },
  { title: "Avg Processing Time", value: "3.2 days", change: "-0.5 days", trend: "down", color: "#9c27b0" },
  { title: "Total Payout", value: "$2.4M", change: "+18.7%", trend: "up", color: "#3f51b5" },
];

const claimsData = [
  { month: "Jan", claims: 186, approved: 120, rejected: 40, pending: 26 },
  { month: "Feb", claims: 205, approved: 142, rejected: 38, pending: 25 },
  { month: "Mar", claims: 237, approved: 168, rejected: 42, pending: 27 },
  { month: "Apr", claims: 193, approved: 134, rejected: 35, pending: 24 },
  { month: "May", claims: 254, approved: 184, rejected: 44, pending: 26 },
  { month: "Jun", claims: 278, approved: 198, rejected: 48, pending: 32 },
];

const statusData = [
  { name: "Approved", value: 896, color: "#4caf50" },
  { name: "Pending", value: 142, color: "#ff9800" },
  { name: "Rejected", value: 246, color: "#f44336" },
];

const payoutData = [
  { month: "Jan", amount: 320000 },
  { month: "Feb", amount: 385000 },
  { month: "Mar", amount: 442000 },
  { month: "Apr", amount: 398000 },
  { month: "May", amount: 467000 },
  { month: "Jun", amount: 521000 },
];

const initialWorkOrders: WorkOrder[] = [
  { id: "WO-1234", claimant: "John Smith", type: "Auto Accident", amount: "$15,250", status: "approved", priority: "high", assignee: "Sarah Johnson", date: "2025-10-03" },
  { id: "WO-1235", claimant: "Emily Davis", type: "Property Damage", amount: "$8,420", status: "pending", priority: "medium", assignee: "Mike Chen", date: "2025-10-03" },
  { id: "WO-1236", claimant: "Michael Brown", type: "Health Insurance", amount: "$3,680", status: "review", priority: "low", assignee: "Lisa Anderson", date: "2025-10-02" },
  { id: "WO-1237", claimant: "Sarah Wilson", type: "Auto Accident", amount: "$22,100", status: "approved", priority: "high", assignee: "David Lee", date: "2025-10-02" },
  { id: "WO-1238", claimant: "James Miller", type: "Liability Claim", amount: "$12,890", status: "rejected", priority: "medium", assignee: "Sarah Johnson", date: "2025-10-01" },
  { id: "WO-1239", claimant: "Patricia Garcia", type: "Property Damage", amount: "$6,720", status: "pending", priority: "high", assignee: "Mike Chen", date: "2025-10-01" },
];

const parseAmount = (s: string) => Number(s.replace(/[^0-9.-]+/g, "") || 0);


const useWorkOrderId = () => {
  const [idCounter, setIdCounter] = useState<number | null>(null);

  useEffect(() => {
    setIdCounter(1000 + Math.floor(Math.random() * 9000));
  }, []);

  const generateWorkOrderId = () => {
    if (idCounter === null) return "WO-loading"; // Fallback during SSR
    return `WO-${idCounter}`;
  };

  return generateWorkOrderId;
};


export default function DashboardPage(): JSX.Element {
  // table state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [orderBy, setOrderBy] = useState<keyof WorkOrder | undefined>("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  // data
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);

  // dialogs
  const [workOrderDialog, setWorkOrderDialog] = useState<boolean>(false);

  // ui
  const [chartTab, setChartTab] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  // FIXED: Client-side only ID generator
  const generateWorkOrderId = useWorkOrderId();

  /** filter + sort */
  const filteredSorted = useMemo(() => {
    let rows = [...workOrders];

    if (orderBy) {
      rows = rows.sort((a, b) => {
        const av = a[orderBy];
        const bv = b[orderBy];

        if (orderBy === "amount") {
          return (parseAmount(String(av)) - parseAmount(String(bv))) * (order === "asc" ? 1 : -1);
        }

        if (orderBy === "date") {
          return (new Date(String(av)).getTime() - new Date(String(bv)).getTime()) * (order === "asc" ? 1 : -1);
        }

        return String(av).localeCompare(String(bv)) * (order === "asc" ? 1 : -1);
      });
    }

    return rows;
  }, [workOrders, orderBy, order]);

  const pageData = useMemo(
    () => filteredSorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredSorted, page, rowsPerPage]
  );

  /** AppTable columns */
  const columns: Column<WorkOrder>[] = [
    { id: "id", label: "Order ID", sortable: true },
    { id: "claimant", label: "Claimant", sortable: true },
    { id: "type", label: "Type", sortable: true },
    { id: "amount", label: "Amount", sortable: true, render: (row) => row.amount },
    { id: "status", label: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    {
      id: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <Chip
          label={row.priority}
          size="small"
          color={row.priority === "high" ? "error" : row.priority === "medium" ? "warning" : "default"}
        />
      ),
    },
    { id: "assignee", label: "Assignee", sortable: true },
    { id: "date", label: "Date", sortable: true },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            setActionAnchor(e.currentTarget);
            setSelectedRow(row.id);
          }}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  /** table handlers */
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setPage(0);
  };
  const handleSortChange = (id: keyof WorkOrder) => {
    if (orderBy === id) setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(id);
      setOrder("asc");
    }
  };
  const handleRowClick = (row: WorkOrder) => {
    console.log("row clicked", row);
  };

  const closeActionMenu = () => {
    setActionAnchor(null);
    setSelectedRow(null);
  };

  const handleDeleteRow = (id?: string) => {
    if (!id) return;
    setWorkOrders((prev) => prev.filter((r) => r.id !== id));
    closeActionMenu();
    setSnackMessage("Work order deleted");
    setSnackOpen(true);
  };

  /** AddWorkOrderForm handler - FIXED date generation */
  const handleAddWorkOrderSubmit = (values: AddWorkOrderFormValues) => {
    const id = generateWorkOrderId();

    const rawAmount = values.amount ?? values.amountFormatted ?? "$0";
    const amountStr = typeof rawAmount === "number" ? `$${rawAmount.toLocaleString()}` : String(rawAmount);

    const claimantName = (values.claimant ?? `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim()) || "Unnamed";

    // FIXED: Use client-side only date
    const today = new Date().toISOString().split("T")[0];

    const newOrder: WorkOrder = {
      id,
      claimant: claimantName,
      type: values.claimType ?? values.type ?? "Other",
      amount: amountStr,
      status: values.status ?? "pending",
      priority: values.priority ?? "medium",
      assignee: values.assignee ?? "Unassigned",
      date: today,
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    setWorkOrderDialog(false);
    setSnackMessage("Work order created");
    setSnackOpen(true);
    setPage(0);
  };

  return (
    <CustomThemeProvider>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Quick Actions */}
          <Card sx={{ mb: 4, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h6">Quick Actions</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Frequently used operations
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <AppButton variant="contained" startIcon={<Add />} onClick={() => setWorkOrderDialog(true)}>
                    Add New Work Order
                  </AppButton>
                  <AppButton variant="outlined" startIcon={<Description />}>
                    Generate Report
                  </AppButton>
                  <AppButton variant="outlined" startIcon={<Download />}>
                    Export Data
                  </AppButton>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Box sx={{ display: "grid", gap: 3, mb: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" } }}>
            {metrics.map((m) => (
              <Card key={m.title} sx={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", transition: "all 0.3s", "&:hover": { transform: "translateY(-8px)", boxShadow: 6 } }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {m.title}
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {m.value}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: m.trend === "up" ? "#4caf50" : "#f44336" }}>
                          {m.change}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          vs last month
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar sx={{ bgcolor: m.color, width: 56, height: 56 }}>
                      {m.title.charAt(0)}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Charts */}
          <Box sx={{ display: "grid", gap: 3, mb: 4, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
            <Card sx={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Analytics Overview</Typography>
                  <Tabs value={chartTab} onChange={(_, v) => setChartTab(v)}>
                    <Tab label="Claims Trend" />
                    <Tab label="Payout Trend" />
                  </Tabs>
                </Box>

                {chartTab === 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={claimsData}>
                      <defs>
                        <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="claims" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClaims)" name="Total Claims" />
                      <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={1} fill="url(#colorApproved)" name="Approved" />
                      <Area type="monotone" dataKey="rejected" stroke="#ef4444" fillOpacity={1} fill="url(#colorRejected)" name="Rejected" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {chartTab === 1 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={payoutData}>
                      <defs>
                        <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                      <Bar dataKey="amount" fill="url(#colorPayout)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card sx={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Claims Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                      outerRadius={80} 
                      fill="#8884d8" 
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 2 }}>
                  {statusData.map((item) => (
                    <Box key={item.name} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                      <Typography variant="body2">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Work Orders */}
          <Card sx={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h6">Recent Work Orders</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest claims and their status
                  </Typography>
                </Box>
                <AppButton variant="outlined">
                  View All
                </AppButton>
              </Box>

              <AppTable<WorkOrder>
                columns={columns}
                data={pageData}
                loading={false}
                total={filteredSorted.length}
                page={page}
                rowsPerPage={rowsPerPage}
                orderBy={orderBy}
                order={order}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSortChange={handleSortChange}
                onRowClick={handleRowClick}
              />

              <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={closeActionMenu}>
                <MenuItem onClick={() => { console.log("View", selectedRow); closeActionMenu(); }}>
                  <Visibility sx={{ mr: 1, fontSize: 20 }} /> View Details
                </MenuItem>
                <MenuItem onClick={() => { console.log("Edit", selectedRow); closeActionMenu(); }}>
                  <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => { handleDeleteRow(selectedRow ?? undefined); }} sx={{ color: "error.main" }}>
                  <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Container>

        {/* Add Work Order Dialog */}
        <Dialog open={workOrderDialog} onClose={() => setWorkOrderDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Work Order</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 1 }}>
              <AddWorkOrderForm 
                onSubmit={handleAddWorkOrderSubmit} 
                onCancel={() => setWorkOrderDialog(false)} 
              />
            </Box>
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackOpen} autoHideDuration={3500} onClose={() => setSnackOpen(false)}>
          <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
            {snackMessage}
          </Alert>
        </Snackbar>
      </Box>
    </CustomThemeProvider>
  );
}