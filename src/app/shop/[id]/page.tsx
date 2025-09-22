"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import { Shop } from "@/types/shop";

export default function ShopDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const shopId = Number(params.id);

  const [data, setData] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/shops/${shopId}`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);
        if (alive) setData(body as Shop);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load shop");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [shopId]);

  const updatedAt = useMemo(() => {
    const ts = data?.updated_at || data?.updated_at;
    if (!ts) return "";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? ts : d.toLocaleString();
  }, [data]);

  return (
    <Box sx={{ maxWidth: 840, mx: "auto", py: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">
          {loading ? <Skeleton width={220} /> : data ? data.shop_name : "Shop"}
        </Typography>

        <Stack direction="row" spacing={1}>
          {!loading && data && (
            <Chip
              size="small"
              label={data.status}
              color={data.status === "active" ? "success" : "default"}
              variant="outlined"
            />
          )}
          <Button
            variant="contained"
            onClick={() => router.push(`/shop/${shopId}/edit`)}
          >
            Edit
          </Button>
        </Stack>
      </Stack>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2} divider={<Divider />}>
          {/* Code / Name */}
          <Row
            title="Code"
            value={loading ? <Skeleton width={120} /> : data?.code}
          />
          <Row
            title="Shop Name"
            value={loading ? <Skeleton width={220} /> : data?.shop_name}
          />

          {/* Address */}
          <Row
            title="Address"
            value={
              loading ? (
                <Skeleton width={360} />
              ) : data ? (
                `${data.address}, ${data.city}, ${data.province} • ${data.postal_code}`
              ) : undefined
            }
          />

          {/* Contacts */}
          <Row
            title="Contact"
            value={
              loading ? (
                <Skeleton width={320} />
              ) : data ? (
                `${data.contact_name} • ${data.phone} • ${data.email}`
              ) : undefined
            }
          />

          {/* Timestamps */}
          <Row
            title="Last Updated"
            value={loading ? <Skeleton width={200} /> : updatedAt || "—"}
          />
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => router.push("/shop")}>
          Back to list
        </Button>
      </Stack>
    </Box>
  );
}

/** Simple key-value row for clean layout */
function Row({
  title,
  value,
}: {
  title: string;
  value?: React.ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      <Typography
        variant="body2"
        sx={{ width: { sm: 160 }, color: "text.secondary" }}
      >
        {title}
      </Typography>
      <Typography variant="body1">{value ?? "—"}</Typography>
    </Stack>
  );
}
