import { WorkOrder, WorkOrderStatus } from "../types/workOrder";
import { Shop, ShopStatus } from "../types/shop";
import { DefectMode, DefectQuote, RepairSummary } from "@/types/defect";
import { Claim } from "@/types/claim";

// Mock data
const mockWorkOrders: WorkOrder[] = [
  {
    WorkOrderID: "WO-1001",
    Status: WorkOrderStatus.WaitingForInspection,
    DateReceived: "2024-06-01T09:00:00Z",
    DateUpdate: "2024-06-01T09:00:00Z",
    FirstName: "Alice",
    LastName: "Smith",
    Email: "alice.smith@example.com",
    Phone: "123-456-7890",
    VIN: "1HGCM82633A004352",
    UserID: "user-001",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
  {
    WorkOrderID: "WO-1002",
    Status: WorkOrderStatus.InProgress,
    DateReceived: "2024-06-02T10:30:00Z",
    DateUpdate: "2024-06-03T12:00:00Z",
    FirstName: "Bob",
    LastName: "Johnson",
    Email: "bob.johnson@example.com",
    Phone: "234-567-8901",
    VIN: "2T1BURHE5JC123456",
    UserID: "user-002",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
  {
    WorkOrderID: "WO-1003",
    Status: WorkOrderStatus.Completed,
    DateReceived: "2024-05-28T08:15:00Z",
    DateUpdate: "2024-06-01T15:45:00Z",
    FirstName: "Carol",
    LastName: "Williams",
    Email: "carol.williams@example.com",
    Phone: "345-678-9012",
    VIN: "3FA6P0H74HR123456",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
  {
    WorkOrderID: "WO-1004",
    Status: WorkOrderStatus.WaitingForInspection,
    DateReceived: "2024-06-04T11:20:00Z",
    DateUpdate: "2024-06-04T11:20:00Z",
    FirstName: "David",
    LastName: "Brown",
    Email: "david.brown@example.com",
    Phone: "456-789-0123",
    VIN: "4T1BF1FK5GU123456",
    UserID: "user-003",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
  {
    WorkOrderID: "WO-1005",
    Status: WorkOrderStatus.InProgress,
    DateReceived: "2024-06-05T14:00:00Z",
    DateUpdate: "2024-06-06T09:30:00Z",
    FirstName: "Eve",
    LastName: "Davis",
    Email: "eve.davis@example.com",
    Phone: "567-890-1234",
    VIN: "5NPE24AF4FH123456",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
  {
    WorkOrderID: "WO-1006",
    Status: WorkOrderStatus.Completed,
    DateReceived: "2024-05-30T07:45:00Z",
    DateUpdate: "2024-06-02T13:15:00Z",
    FirstName: "Frank",
    LastName: "Miller",
    Email: "frank.miller@example.com",
    Phone: "678-901-2345",
    VIN: "1C4RJFBG7FC123456",
    UserID: "user-001",
    Address: "",
    City: "",
    State: "",
    ZIP: "",
    Make: "",
    Model: "",
    BodyStyle: "",
    Year: "",
    Color: "",
    DamageDate: "",
    PlateNumber: "",
  },
];

// Mock API function
export function fetchWorkOrders(): WorkOrder[] {
  return mockWorkOrders;
}

const defectQuotes: DefectQuote[] = [
  {
    ID: 1,
    Image: "frame_000",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    EstCharge: 180,
  },
  {
    ID: 2,
    Image: "frame_001",
    Size: "1280x720",
    Mode: DefectMode.Skip,
    EstCharge: 0,
  },
  {
    ID: 3,
    Image: "frame_002",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    EstCharge: 325.5,
  },
  {
    ID: 4,
    Image: "frame_003",
    Size: "1024x768",
    Mode: DefectMode.Fixed,
    EstCharge: 95,
  },
  {
    ID: 5,
    Image: "frame_004",
    Size: "2560x1440",
    Mode: DefectMode.Skip,
    EstCharge: 0,
  },
  {
    ID: 6,
    Image: "frame_005",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    EstCharge: 210,
  },
  {
    ID: 7,
    Image: "frame_006",
    Size: "1280x720",
    Mode: DefectMode.Fixed,
    EstCharge: 145.75,
  },
  {
    ID: 8,
    Image: "frame_007",
    Size: "1960x1080",
    Mode: DefectMode.Skip,
    EstCharge: 0,
  },
  {
    ID: 9,
    Image: "frame_008",
    Size: "1920x1080",
    Mode: DefectMode.Fixed,
    EstCharge: 480,
  },
  {
    ID: 10,
    Image: "frame_009",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    EstCharge: 260.99,
  },
];

export function fetchDefectQuotes(): DefectQuote[] {
  return defectQuotes;
}

export const mockRepairSummary: RepairSummary = {
  "Repair Shop": "#0001",
  "Technician Name": "An-Ni",
  "Pre-Authorized Dispatch": "Yes",
  defectQuotes,
};

export function fetchRepairSummary(): RepairSummary {
  return mockRepairSummary;
}

export const mockClaim: Claim = {
  InsuranceClaimed: true,
  ClaimApproved: false,
  Claim: "#123456",
  Note: "Customer to provide additional documents.",
};

export function fetchClaim(): Claim {
  return mockClaim;
}