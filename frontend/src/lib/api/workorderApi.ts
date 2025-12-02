//workorderApi.ts —— frontend-only adapter (no backend changes)
import { getAuth } from "firebase/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

// Get auth headers with fresh token
const getAuthHeaders = async (): Promise<HeadersInit> => {
  if (typeof window === "undefined") return {};

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return {};

  // Get fresh ID token from Firebase
  const token = await user.getIdToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ========== Normalized types for UI ==========
export interface WorkOrderListItem {
  id: string;
  code: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;

  customerFullName?: string;
  customerEmail?: string;

  // if backend already joins vehicle fields, keep them optional
  plateNumber?: string;
  make?: string;
  model?: string;
}

export interface WorkOrderDetail extends WorkOrderListItem {
  // extend if your detail API returns richer fields
  dateReceived?: string;
  dateUpdated?: string;
  customerPhone?: string;
  customerAddress?: string;
  // ...add optional fields here safely
}

// work order intake form dtos
export interface CustomerIntake { 
  firstName: string; 
  lastName: string; 
  address: string; 
  city: string; 
  postalCode: string; 
  province: string; 
  email: string; 
  phone: string; 
} 
 
export interface InsuranceIntake { 
  insuranceCompany: string; 
  agentFirstName: string; 
  agentLastName: string; 
  agentPhone: string; 
  policyNumber: string;
  claimNumber: string; 
}
 
export interface VehicleIntake { 
  plateNo: string; 
  make: string; 
  model: string;
  bodyStyle: string;
  modelYear: number;
  vin: string;
  color: string;
}
 
export interface IntakePayload {
  customer: CustomerIntake;
  vehicle: VehicleIntake;
  insurance: InsuranceIntake | null; 
}
// ========== Helpers ==========

function safeStr(x: unknown): string | undefined {
  return typeof x === "string" ? x : undefined;
}

function coalesce<T>(...vals: T[]): T | undefined {
  for (const v of vals) if (v !== undefined && v !== null && (v as any) !== "") return v;
  return undefined;
}

function buildFullName(
  first?: string,
  last?: string,
  full?: string
): string | undefined {
  const fromParts =
    [first, last].filter((s) => !!s && String(s).trim().length > 0).join(" ").trim() ||
    undefined;
  return full?.trim() || fromParts;
}

// Accepts a backend row with many possible shapes and normalizes it
function normalizeListRow(row: any): WorkOrderListItem {
  // IDs & codes
  const id = coalesce(safeStr(row.work_order_id), safeStr(row.id))!;
  const code = coalesce(
    safeStr(row.work_order_code),
    safeStr(row.code),
    safeStr(row.workOrderCode)
  )!;

  // Status & timestamps
  const status = coalesce(safeStr(row.status), safeStr(row.work_order_status)) || "unknown";
  const createdAt = coalesce(
    safeStr(row.created_at),
    safeStr(row.date_received),
    safeStr(row.createdAt),
    safeStr(row.dateReceived)
  );
  const updatedAt = coalesce(
    safeStr(row.updated_at),
    safeStr(row.date_updated),
    safeStr(row.updatedAt),
    safeStr(row.dateUpdated)
  );

  // Customer — allow nested or flat
  const cust = row.customer || {};
  const nameFromParts = buildFullName(
    coalesce(safeStr(row.first_name), safeStr(cust.first_name), safeStr(cust.firstName)),
    coalesce(safeStr(row.last_name), safeStr(cust.last_name), safeStr(cust.lastName)),
    coalesce(safeStr(row.full_name), safeStr(cust.full_name), safeStr(cust.fullName))
  );

  const customerFullName = coalesce(
    safeStr(row.customerFullName),
    nameFromParts
  );

  const customerEmail = coalesce(
    safeStr(row.email),
    safeStr(cust.email),
    safeStr(row.customer_email),
    safeStr(row.customerEmail)
  );

  // Vehicle — allow nested or flat
  const veh = row.vehicle || {};
  const plateNumber = coalesce(
    safeStr(row.plateNo),
    safeStr(veh.plateNo),
    safeStr(veh.plateNo)
  );
  const make = coalesce(safeStr(row.make), safeStr(veh.make));
  const model = coalesce(safeStr(row.model), safeStr(veh.model));

  return {
    id,
    code,
    status,
    createdAt,
    updatedAt,
    customerFullName,
    customerEmail,
    plateNumber,
    make,
    model,
  };
}

function normalizeDetailRow(row: any): WorkOrderDetail {
  const base = normalizeListRow(row);
  const dateReceived = coalesce(
    safeStr(row.date_received),
    safeStr(row.dateReceived),
    safeStr(row.created_at)
  );
  const dateUpdated = coalesce(
    safeStr(row.date_updated),
    safeStr(row.dateUpdated),
    safeStr(row.updated_at)
  );

  const cust = row.customer || {};
  const customerPhone = coalesce(
    safeStr(row.phone),
    safeStr(cust.phone),
    safeStr(row.customer_phone)
  );
  const customerAddress = coalesce(
    safeStr(row.address),
    safeStr(cust.address),
    safeStr(row.customer_address)
  );

  return {
    ...base,
    dateReceived,
    dateUpdated,
    customerPhone,
    customerAddress,
  };
}

// ========== API Calls (front-end only; backend unchanged) ==========

/**
 * Fetch work orders list from backend as-is and normalize to WorkOrderListItem[]
 * Backend endpoint (unchanged): GET /workorders
 */
export async function getWorkOrders(): Promise<WorkOrderListItem[]> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(await getAuthHeaders()),
  };

  const res = await fetch(`${API_BASE}/workorders`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /workorders failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  const rows: any[] = Array.isArray(data) ? data : [data];
  return rows.map(normalizeListRow);
}

/**
 * Get detail by code (or id), with backend’s current behavior tolerated:
 * - Accepts object or array
 * - Accepts snake_case or camelCase
 * Backend endpoint (unchanged): GET /workorders/{code}
 */
export async function getWorkOrderByCode(codeOrId: string): Promise<WorkOrderDetail> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(await getAuthHeaders()),
  };

  const res = await fetch(`${API_BASE}/workorders/${encodeURIComponent(codeOrId)}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /workorders/${codeOrId} failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("Empty response for work order detail.");
  return normalizeDetailRow(row);
}

export async function createWorkOrder(
  payload: IntakePayload
): Promise<WorkOrderDetail> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(await getAuthHeaders()),
  };

  const res = await fetch(`${API_BASE}/workorders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST /workorders failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("Empty response after creating work order.");
  return normalizeDetailRow(row);
}

