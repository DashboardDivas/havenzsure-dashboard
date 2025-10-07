"use client";

import { useEffect, useState } from "react";
import { ShopsAPI } from "@/lib/api/shop";
import { Shop } from "@/types/shop";
import { Typography, Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import StatusChip from "@/components/ui/StatusChip";
import Button from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const [rows, setRows] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    ShopsAPI.list()
      .then((res) => setRows(res.items))
      .finally(() => setLoading(false));
  }, []);

  const columns: GridColDef<Shop>[] = [
    { field: "code", headerName: "Code", width: 100 },
    { field: "shop_name", headerName: "Name", flex: 1, minWidth: 150 },
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
    { field: "postal_code", headerName: "Postal Code", width: 120 },
    {
      field: "contact",
      headerName: "Contact",
      width: 220,
      valueGetter: (_value, row) => `${row.contact_name}`,
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

  const handleRowClick = (params: GridRowParams<Shop>) => {
    // 你的 MSW handlers 按数值 id 提供详情接口：/api/shops/:id
    router.push(`/shop/${params.row.id}`);
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        width: "100%",
      }}
    >
      <Box className="flex items-center justify-between" sx={{ mb: 4 }}>
        <Typography variant="h5" className="font-semibold">
          Shops Overview
        </Typography>
        <Button onClick={() => router.push("/shop/new")}>Add New Shop</Button>
      </Box>

      <DataGrid<Shop>
        sx={{
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
          "& .MuiDataGrid-row:hover": { cursor: "pointer" },
        }}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
