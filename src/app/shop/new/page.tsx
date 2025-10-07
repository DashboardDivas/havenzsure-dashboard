"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Alert } from "@mui/material";
import ShopForm from "@/components/shops/ShopForm";


export default function NewShopPage() {
  const router = useRouter();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = async (values: any) => {
    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      setMsg({ type: "success", text: "Shop created successfully." });
      router.push("/shop");
    } catch (e: any) {
      setMsg({ type: "error", text: e?.message || "Failed to create shop." });
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Shop
      </Typography>

      {msg && (
        <Alert severity={msg.type} sx={{ mb: 2 }} onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}

      <ShopForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={() => router.back()}
      />
    </Box>
  );
}
