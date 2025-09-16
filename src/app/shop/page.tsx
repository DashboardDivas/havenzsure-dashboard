"use client";

import {useEffect, useState} from "react";
import {fetchShops} from "@/lib/fakeApi";
import {Shop, ShopStatus} from "@/types/shop";
import { InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StatusChip from "@/components/ui/StatusChip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/Table";
import Button from "@/components/ui/PrimaryButton";

export default function ShopPage() {
  const [rows, setRows]=useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops().then((data)=>{
      setRows(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-muted-foreground">Loading shops…</div>;
  if (!rows.length) return <div className="p-4 text-muted-foreground">No shops yet.</div>;

  return (
    <div className="w-full">
      <Typography variant="h5" sx={{ mb: 4 }}>Shops Overview</Typography>

    <div className="flex items-center justify-between mb-4">
      <TextField
        size="small"
        placeholder="Enter Shop ID, Name, Address"
        InputProps={{
          startAdornment: (
          <InputAdornment position="start">
          <SearchIcon fontSize="small" />
          </InputAdornment>
      ),
    }}
    className="w-[280px]"
  />

  <Button onClick={() => alert("Let's see whether AnNi wants dummy data or a real form.")}>
    Add New Shop
  </Button>
</div>
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Shop ID</TableHead>
            <TableHead className="min-w-[220px]">Name</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="min-w-[280px]">Address</TableHead>
            <TableHead className="w-[140px]">Postal Code</TableHead>
            <TableHead className="w-[160px]">Contact</TableHead>
            <TableHead className="w-[220px]">Email</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((shop) => (
            <TableRow key={shop.ShopId} className="hover:bg-muted/50">
              <TableCell className="font-medium">{shop.ShopId}</TableCell>
              <TableCell>{shop.Name}</TableCell>
              <TableCell><StatusChip status={shop.Status} /></TableCell>
              <TableCell>{shop.Address}</TableCell>
              <TableCell>{shop.PostalCode}</TableCell>
              <TableCell>{shop.ContactPerson}</TableCell>
              <TableCell>{shop.ContactEmail}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableCaption>Showing {rows.length} shop(s)</TableCaption>
      </Table>
    </div>
  );
}