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

//Mock data for shops

// S002-S009 ARE CREATED BY CHATGPT.

//PROMPT: Finish SHOP INFO FROM S002 TO S009 BASED ON THE FORMAT OF S001.

const mockShops: Shop[] = [
  {
    ShopId: "S001",

    Name: "Shop One",

    Status: ShopStatus.Active,

    Address: "123 Main ST, Calgary, AB",

    PostalCode: "T1X 1Y1",

    ContactPerson: "Name One",

    ContactEmail: "email.one@example.com",
  },

  {
    ShopId: "S002",

    Name: "Prairie Auto Works",

    Status: ShopStatus.Active,

    Address: "200 9 Ave SW, Calgary, AB",

    PostalCode: "T2P 2M5",

    ContactPerson: "Alice Johnson",

    ContactEmail: "alice.johnson@example.com",
  },

  {
    ShopId: "S003",

    Name: "Foothills Collision Center",

    Status: ShopStatus.Inactive,

    Address: "8900 14 St SW, Calgary, AB",

    PostalCode: "T2V 1P6",

    ContactPerson: "Bob Smith",

    ContactEmail: "bob.smith@example.com",
  },

  {
    ShopId: "S004",

    Name: "Riverbend Repair Garage",

    Status: ShopStatus.Active,

    Address: "55 Riverbend Dr SE, Calgary, AB",

    PostalCode: "T2C 3X1",

    ContactPerson: "Carol White",

    ContactEmail: "carol.white@example.com",
  },

  {
    ShopId: "S005",

    Name: "North Peak Auto Body",

    Status: ShopStatus.Inactive,

    Address: "1234 10 St NW, Calgary, AB",

    PostalCode: "T2K 2Z9",

    ContactPerson: "David Lee",

    ContactEmail: "david.lee@example.com",
  },

  {
    ShopId: "S006",

    Name: "Horizon Dent & Frame",

    Status: ShopStatus.Active,

    Address: "742 Evergreen Rd SW, Calgary, AB",

    PostalCode: "T2Y 0J9",

    ContactPerson: "Emily Brown",

    ContactEmail: "emily.brown@example.com",
  },

  {
    ShopId: "S007",

    Name: "Stampede Auto Service",

    Status: ShopStatus.Inactive,

    Address: "450 4 St SE, Calgary, AB",

    PostalCode: "T2G 1Y5",

    ContactPerson: "Frank Wilson",

    ContactEmail: "frank.wilson@example.com",
  },

  {
    ShopId: "S008",

    Name: "Chinook Paint & Body",

    Status: ShopStatus.Active,

    Address: "100 Chinook Centre, Calgary, AB",

    PostalCode: "T2H 0K5",

    ContactPerson: "Grace Taylor",

    ContactEmail: "grace.taylor@example.com",
  },

  {
    ShopId: "S009",

    Name: "Bow Valley Motors",

    Status: ShopStatus.Inactive,

    Address: "300 Bow Valley Trail, Calgary, AB",

    PostalCode: "T2P 3N4",

    ContactPerson: "Henry Davis",

    ContactEmail: "henry.davis@example.com",
  },
];

// Mock API function for shops

export function fetchShops(): Promise<Shop[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockShops);
    }, 500); // simulate network delay, as what have done for workorder above
  });
}

const mockDefectQuotes: DefectQuote[] = [
  {
    ID: 1,
    Image: "frame_000",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    "Est.Charge": 180,
  },
  {
    ID: 2,
    Image: "frame_001",
    Size: "1280x720",
    Mode: DefectMode.Skip,
    "Est.Charge": 0,
  },
  {
    ID: 3,
    Image: "frame_002",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    "Est.Charge": 325.5,
  },
  {
    ID: 4,
    Image: "frame_003",
    Size: "1024x768",
    Mode: DefectMode.Fixed,
    "Est.Charge": 95,
  },
  {
    ID: 5,
    Image: "frame_004",
    Size: "2560x1440",
    Mode: DefectMode.Skip,
    "Est.Charge": 0,
  },
  {
    ID: 6,
    Image: "frame_005",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    "Est.Charge": 210,
  },
  {
    ID: 7,
    Image: "frame_006",
    Size: "1280x720",
    Mode: DefectMode.Fixed,
    "Est.Charge": 145.75,
  },
  {
    ID: 8,
    Image: "frame_007",
    Size: "1960x1080",
    Mode: DefectMode.Skip,
    "Est.Charge": 0,
  },
  {
    ID: 9,
    Image: "frame_008",
    Size: "1920x1080",
    Mode: DefectMode.Fixed,
    "Est.Charge": 480,
  },
  {
    ID: 10,
    Image: "frame_009",
    Size: "1960x1080",
    Mode: DefectMode.Fixed,
    "Est.Charge": 260.99,
  },
];

export function fetchDefectQuotes(): DefectQuote[] {
  return mockDefectQuotes;
}

export const mockRepairSummary: RepairSummary = {
  "Repair Shop": "#0001",
  "Technician Name": "An-Ni",
  "Pre-Authorized Dispatch": "Yes",
  mockDefectQuotes,
};

export function fetchRepairSummary(): RepairSummary {
  return mockRepairSummary;
}

export const mockClaim: Claim = {
  "Insurance Claimed": true,
  "Claim Approved": false,
  Claim: "#123456",
};

export function fetchClaim(): Claim {
  return mockClaim;
}
