"use client";

import { useEffect, useState } from "react";
import { ShopsAPI } from "@/lib/api/shop";
import { Shop } from "@/types/shop";
import { Typography, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import StatusChip from "@/components/ui/StatusChip";
import Button from "@/components/ui/PrimaryButton";

export default function ShopPage() {
  const [rows, setRows] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ShopsAPI.list().then(setRows).finally(() => setLoading(false));
  }, []);

  const columns: GridColDef<Shop>[] = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "shopName", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => <StatusChip status={params.value as Shop["status"]} />,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 200,
      valueGetter: (_value, row) => `${row.address}, ${row.city}, ${row.province}`,
    },
    { field: "postalCode", headerName: "Postal Code", width: 100 },
    {
      field: "contact",
      headerName: "Contact",
      width: 100,
      valueGetter: (_value, row) => `${row.contactName}`,
      renderCell: (params) => {
        const [name, phone] = String(params.value ?? "").split("|||");
        return (
          <div>
            <div>{name}</div>
            <div className="text-xs text-muted-foreground">{phone}</div>
          </div>
        );
      },
      sortable: false,
    },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
  ];

  return (
    <Box sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        width: "100%",
      }}
    >
    <Box
      className="flex items-center justify-between"
      sx={{ mb: 4 }}
    >
      <Typography variant="h5" className="font-semibold">
        Shops Overview
      </Typography>
      <Button onClick={() => alert("TODO: Hook up create-shop form")}>
        Add New Shop
      </Button>
    </Box>
      <DataGrid<Shop>
        sx={{
            "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
      }}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          //sorting: { sortModel: [{ field: "updatedAt", sort: "desc" }] },
        }}
      />
    </Box>
  );
}
