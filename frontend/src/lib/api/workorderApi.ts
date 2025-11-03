// ✅ WorkOrder API client (frontend → backend)

export interface CustomerInfo {
  full_name: string;
  phone: string;
  email: string;
  address: string;
}

export interface VehicleInfo {
  plate_number: string;
  make: string;
  model: string;
}

export interface WorkOrder {
  work_order_id: string;
  work_order_code: string;
  status: string;
  date_received: string;
  date_updated: string;
  customer: CustomerInfo;
  vehicle: VehicleInfo;
}

// ---------------------------
// Request body for creating work orders
// ---------------------------
export interface WorkOrderInput {
  damageDate?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  vehicle: {
    vin: string;
    plateNumber: string;
    make: string;
    model: string;
    bodyStyle: string;
    year: number;
    color: string;
  };
  insurance?: {
    insuranceCompany: string;
    agentFirstName: string;
    agentLastName: string;
    agentPhone: string;
    policyNumber: string;
    claimNumber: string;
  };
  shopId: string;
  createdByUserId: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// ---------------------------
// GET /api/work-orders
// ---------------------------
export async function getWorkOrders(): Promise<WorkOrder[]> {
  const res = await fetch(`${API_BASE}/work-orders`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch work orders: ${res.status} ${text}`);
  }

  return res.json();
}

// ---------------------------
// POST /api/work-orders
// ---------------------------
export async function createWorkOrder(
  data: WorkOrderInput
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/work-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create work order: ${res.status} ${text}`);
  }

  return res.json();
}
