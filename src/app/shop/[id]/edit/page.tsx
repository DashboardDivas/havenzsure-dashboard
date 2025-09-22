"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Alert, Skeleton } from "@mui/material";
import ShopForm from "@/components/shops/ShopForm";
import type { ShopUpdateInput } from "@/schemas/shop";
import type {Shop} from "@/types/shop";

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [initial, setInitial] = useState<Partial<ShopUpdateInput> | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load detail (no cache) -> fill form
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/shops/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
        if (alive) {
          // Detail already uses snake_case; pass through as initial values
          setInitial({
            code: data.code,
            shop_name: data.shop_name,
            status: data.status,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email,
          });
        }
      } catch (e: any) {
        if (alive) setMsg({ type: "error", text: e?.message || "Failed to load shop" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleUpdate = async (values: any) => {
    try {
      const res = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values as ShopUpdateInput), // snake_case payload
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      // success -> go back to detail page
      router.push(`/shop/${id}`);
    } catch (e: any) {
      setMsg({ type: "error", text: e?.message || "Failed to update shop" });
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {loading ? <Skeleton width={220} /> : "Edit Shop"}
      </Typography>

      {msg && (
        <Alert severity={msg.type} sx={{ mb: 2 }} onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ mt: 1 }}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </Box>
      ) : initial ? (
        <ShopForm
          mode="update"
          initial={initial}
          onSubmit={handleUpdate}
          onCancel={() => router.back()}
        />
      ) : (
        <Alert severity="error">Shop not found.</Alert>
      )}
    </Box>
  );
}
