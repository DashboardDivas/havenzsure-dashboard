"use client";

// ShopForm: presentational component that validates with your existing Zod schemas.
// It returns snake_case values via onSubmit and does not persist anything itself.

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

// ✅ 全部从你已有的 schema 导入（不要在这里重复定义）
import {
  ShopCreateSchema,
  ShopUpdateSchema,
  type ShopCreateInput,
  type ShopUpdateInput,
  PROVINCES,
  SHOP_STATUS,
} from "@/schemas/shop";

type FormValues = ShopCreateInput | ShopUpdateInput;

type ShopFormProps = {
  mode: "create" | "update";
  initial?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export default function ShopForm(props: ShopFormProps) {
  const schema = props.mode === "create" ? ShopCreateSchema : ShopUpdateSchema;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: props.initial?.code ?? "",
      shop_name: props.initial?.shop_name ?? "",
      status:
        (props.initial?.status as FormValues extends { status: infer S } ? S : any) ??
        "active",
      address: props.initial?.address ?? "",
      city: props.initial?.city ?? "",
      province: props.initial?.province ?? undefined,
      postal_code: props.initial?.postal_code ?? "",
      contact_name: props.initial?.contact_name ?? "",
      phone: props.initial?.phone ?? "",
      email: props.initial?.email ?? "",
    } as any,
    mode: "onBlur",
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(props.onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              size="small"
              inputProps={{ maxLength: 10 }}
              error={!!errors.code}
              helperText={errors.code?.message as string}
            />
          )}
        />

        <Controller
          name="shop_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Shop Name"
              size="small"
              error={!!errors.shop_name}
              helperText={errors.shop_name?.message as string}
            />
          )}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl size="small" error={!!errors.status} sx={{ minWidth: 180 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="status-label"
                  label="Status"
                  value={field.value ?? ""}
                >
                  {SHOP_STATUS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message as string}</FormHelperText>
          </FormControl>

          <FormControl size="small" error={!!errors.province} sx={{ minWidth: 180 }}>
            <InputLabel id="province-label">Province</InputLabel>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="province-label"
                  label="Province"
                  value={field.value ?? ""}
                >
                  {PROVINCES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.province?.message as string}</FormHelperText>
          </FormControl>
        </Stack>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address"
              size="small"
              error={!!errors.address}
              helperText={errors.address?.message as string}
            />
          )}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                size="small"
                error={!!errors.city}
                helperText={errors.city?.message as string}
                sx={{ flex: 1 }}
              />
            )}
          />

          <Controller
            name="postal_code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Postal Code"
                size="small"
                placeholder="A1A 1A1"
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message as string}
                sx={{ flex: 1 }}
              />
            )}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="contact_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Name"
                size="small"
                error={!!errors.contact_name}
                helperText={errors.contact_name?.message as string}
                sx={{ flex: 1 }}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                size="small"
                placeholder="403-555-1234"
                error={!!errors.phone}
                helperText={errors.phone?.message as string}
                sx={{ flex: 1 }}
              />
            )}
          />
        </Stack>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="email"
              label="Email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message as string}
            />
          )}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {props.onCancel && (
            <Button variant="outlined" onClick={props.onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {props.mode === "create" ? "Create" : "Update"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
