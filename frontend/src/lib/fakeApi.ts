// src/lib/fakeApi.ts

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar: string;
  repairShop: string;
};

export type WorkOrder = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  plate: string;
  make: string;
  model: string;
  dents: Array<{
    location: string;
    severity: string;
    estimate: number;
  }>;
  customerAvatar?: string;
  repairShop?: string;
  status:
    | "waiting_for_inspection"
    | "in_progress"
    | "follow_up_required"
    | "completed";
  dateReceived: string;
  dateUpdated: string;
};

export type Shop = {
  id: string;
  name: string;
  owner: string;
  status: "active" | "inactive";
  address: string;
  postalCode: string;
  contact: string;
  email: string;
};

export interface Job {
  id: number;
  title: string;
  customer: string;
  assignedTo: string;
  repairShop: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  image?: string;
}

const jobs: Job[] = [
  {
    id: 101,
    title: "Brake Replacement",
    customer: "John Doe",
    assignedTo: "Alex Smith",
    repairShop: "AutoFix Garage",
    status: "in_progress",
    image: "/jobs/brake.jpg",
  },
  {
    id: 102,
    title: "Oil Change",
    customer: "Jane Roe",
    assignedTo: "Chris Lee",
    repairShop: "QuickService Auto",
    status: "completed",
    image: "/jobs/oil.jpg",
  },
  {
    id: 103,
    title: "Tire Rotation",
    customer: "Mike Johnson",
    assignedTo: "Pat Kim",
    repairShop: "TirePros",
    status: "pending",
    image: "/jobs/tire.jpg",
  },
  {
    id: 104,
    title: "Engine Diagnostics",
    customer: "Emily Davis",
    assignedTo: "Sam Brown",
    repairShop: "EngineWorks",
    status: "in_progress",
    image: "/jobs/engine.jpg",
  },
  {
    id: 105,
    title: "Battery Replacement",
    customer: "Chris Green",
    assignedTo: "Taylor White",
    repairShop: "BatteryPlus",
    status: "cancelled",
    image: "/jobs/battery.jpg",
  },
  {
    id: 106,
    title: "Transmission Repair",
    customer: "Pat Taylor",
    assignedTo: "Jordan Black",
    repairShop: "TransFix",
    status: "pending",
    image: "/jobs/transmission.jpg",
  },
  {
    id: 107,
    title: "AC Service",
    customer: "Alex Morgan",
    assignedTo: "Casey Gray",
    repairShop: "CoolAir Auto",
    status: "completed",
    image: "/jobs/ac.jpg",
  },
  {
    id: 108,
    title: "Wheel Alignment",
    customer: "Taylor Wilson",
    assignedTo: "Drew Scott",
    repairShop: "AlignRight",
    status: "in_progress",
    image: "/jobs/alignment.jpg",
  },
  {
    id: 109,
    title: "Suspension Repair",
    customer: "Jordan Lee",
    assignedTo: "Morgan King",
    repairShop: "SmoothRide",
    status: "pending",
    image: "/jobs/suspension.jpg",
  },
  {
    id: 110,
    title: "Exhaust System Repair",
    customer: "Riley Brown",
    assignedTo: "Jamie Fox",
    repairShop: "ExhaustPros",
    status: "completed",
    image: "/jobs/exhaust.jpg",
  },
  {
    id: 111,
    title: "Headlight Replacement",
    customer: "Casey White",
    assignedTo: "Avery Green",
    repairShop: "LightWorks",
    status: "in_progress",
    image: "/jobs/headlight.jpg",
  },
  {
    id: 112,
    title: "Windshield Repair",
    customer: "Drew Black",
    assignedTo: "Cameron Blue",
    repairShop: "GlassFix",
    status: "cancelled",
    image: "/jobs/windshield.jpg",
  },
  {
    id: 113,
    title: "Fuel System Cleaning",
    customer: "Morgan King",
    assignedTo: "Riley Brown",
    repairShop: "FuelPros",
    status: "pending",
    image: "/jobs/fuel.jpg",
  },
  {
    id: 114,
    title: "Brake Fluid Flush",
    customer: "Jamie Fox",
    assignedTo: "Jordan Lee",
    repairShop: "BrakeMasters",
    status: "completed",
    image: "/jobs/brake_fluid.jpg",
  },
  {
    id: 115,
    title: "Cooling System Service",
    customer: "Alex Taylor",
    assignedTo: "Jamie Green",
    repairShop: "CoolTech",
    status: "in_progress",
    image: "/jobs/cooling.jpg",
  },
];

export type Claim = {
  InsuranceClaimed: boolean;
  ClaimApproved: boolean;
  Claim: string;
  Note: string;
};

export enum DefectMode {
  Fixed = "Fixed",
  Skip = "Skip",
}

export interface DefectQuote {
  ID: number;
  Image: string;
  Size: string;
  Mode: DefectMode;
  EstCharge: number;
}

export interface RepairSummary {
  "Repair Shop": string;
  "Technician Name": string;
  "Pre-Authorized Dispatch": string;
  defectQuotes: DefectQuote[];
}

// --- Mock Data --- //
const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "active",
    repairShop: "001",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "User",
    status: "inactive",
    repairShop: "002",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Bodyman",
    status: "inactive",
    repairShop: "003",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Dana White",
    email: "dana@example.com",
    role: "Bodyman",
    status: "active",
    repairShop: "004",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: 5,
    name: "Eve Adams",
    email: "eve@example.com",
    role: "Adjustor",
    status: "active",
    repairShop: "005",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 6,
    name: "Frank Moore",
    email: "frank@example.com",
    role: "User",
    status: "inactive",
    repairShop: "006",
    avatar: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "Adjustor",
    status: "active",
    repairShop: "007",
    avatar: "https://i.pravatar.cc/40?img=7",
  },
  {
    id: 8,
    name: "Hank Miller",
    email: "hank@example.com",
    role: "User",
    status: "active",
    repairShop: "008",
    avatar: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: 9,
    name: "Ivy Wilson",
    email: "ivy@example.com",
    role: "User",
    status: "inactive",
    repairShop: "009",
    avatar: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: 10,
    name: "Jack Taylor",
    email: "jack@example.com",
    role: "Admin",
    status: "inactive",
    repairShop: "010",
    avatar: "https://i.pravatar.cc/40?img=10",
  },
  {
    id: 11,
    name: "Karen Thomas",
    email: "karen@example.com",
    role: "Manager",
    status: "active",
    repairShop: "011",
    avatar: "https://i.pravatar.cc/40?img=11",
  },
  {
    id: 12,
    name: "Liam Scott",
    email: "liam@example.com",
    role: "User",
    status: "inactive",
    repairShop: "012",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: 13,
    name: "Mia Harris",
    email: "mia@example.com",
    role: "Bodyman",
    status: "active",
    repairShop: "013",
    avatar: "https://i.pravatar.cc/40?img=13",
  },
  {
    id: 14,
    name: "Noah Brooks",
    email: "noah@example.com",
    role: "Adjustor",
    status: "inactive",
    repairShop: "014",
    avatar: "https://i.pravatar.cc/40?img=14",
  },
  {
    id: 15,
    name: "Olivia Davis",
    email: "olivia@example.com",
    role: "User",
    status: "active",
    repairShop: "015",
    avatar: "https://i.pravatar.cc/40?img=15",
  },
  {
    id: 16,
    name: "Paul Wright",
    email: "paul@example.com",
    role: "Admin",
    status: "inactive",
    repairShop: "016",
    avatar: "https://i.pravatar.cc/40?img=16",
  },
  {
    id: 17,
    name: "Quinn Foster",
    email: "quinn@example.com",
    role: "Bodyman",
    status: "active",
    repairShop: "017",
    avatar: "https://i.pravatar.cc/40?img=17",
  },
  {
    id: 18,
    name: "Rachel Green",
    email: "rachel@example.com",
    role: "User",
    status: "inactive",
    repairShop: "018",
    avatar: "https://i.pravatar.cc/40?img=18",
  },
  {
    id: 19,
    name: "Sam Parker",
    email: "sam@example.com",
    role: "Adjustor",
    status: "active",
    repairShop: "019",
    avatar: "https://i.pravatar.cc/40?img=19",
  },
  {
    id: 20,
    name: "Tina Lopez",
    email: "tina@example.com",
    role: "User",
    status: "inactive",
    repairShop: "020",
    avatar: "https://i.pravatar.cc/40?img=20",
  },
];

const workOrders: WorkOrder[] = [
  {
    id: "Wo-001",
    customer: "Alice Johnson",
    email: "alice@example.com",
    status: "waiting_for_inspection",
    dateReceived: "13 September 2025",
    dateUpdated: "21 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=1",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    plate: "ABC123",
    make: "Toyota",
    model: "Camry",
    dents: [{ location: "Front Bumper", severity: "Minor", estimate: 250 }],
  },
  {
    id: "Wo-002",
    customer: "Bob Smith",
    email: "bob@example.com",
    status: "completed",
    dateReceived: "4 October 2025",
    dateUpdated: "19 October 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=2",
    phone: "234-567-8901",
    address: "234 Elm St, Othertown, USA",
    plate: "DEF456",
    make: "Honda",
    model: "Civic",
    dents: [{ location: "Rear Bumper", severity: "Major", estimate: 500 }],
  },
  {
    id: "Wo-003",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    status: "in_progress",
    dateReceived: "3 October 2025",
    dateUpdated: "16 October 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=3",
    phone: "345-678-9012",
    address: "345 Oak St, Sometown, USA",
    plate: "GHI789",
    make: "Ford",
    model: "Focus",
    dents: [{ location: "Left Door", severity: "Minor", estimate: 300 }],
  },
  {
    id: "Wo-004",
    customer: "Dana White",
    email: "dana@example.com",
    status: "follow_up_required",
    dateReceived: "3 October 2025",
    dateUpdated: "15 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=4",
    phone: "456-789-0123",
    address: "456 Pine St, Anycity, USA",
    plate: "JKL012",
    make: "Chevrolet",
    model: "Malibu",
    dents: [],
  },
  {
    id: "Wo-005",
    customer: "Eve Adams",
    email: "eve@example.com",
    status: "completed",
    dateReceived: "29 September 2025",
    dateUpdated: "14 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=5",
    phone: "567-890-1234",
    address: "567 Maple St, Anystate, USA",
    plate: "MNO345",
    make: "Nissan",
    model: "Altima",
    dents: [],
  },
  {
    id: "Wo-006",
    customer: "Frank Moore",
    email: "frank@example.com",
    status: "follow_up_required",
    dateReceived: "12 September 2025",
    dateUpdated: "13 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=6",
    phone: "678-901-2345",
    address: "678 Cedar St, Anyplace, USA",
    plate: "PQR678",
    make: "Hyundai",
    model: "Elantra",
    dents: [],
  },
  {
    id: "Wo-007",
    customer: "Grace Lee",
    email: "grace@example.com",
    status: "waiting_for_inspection",
    dateReceived: "11 September 2025",
    dateUpdated: "12 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=7",
    phone: "789-012-3456",
    address: "789 Birch St, Anycity, USA",
    plate: "STU901",
    make: "Kia",
    model: "Soul",
    dents: [],
  },
  {
    id: "Wo-008",
    customer: "Hank Miller",
    email: "hank@example.com",
    status: "completed",
    dateReceived: "10 September 2025",
    dateUpdated: "11 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=8",
    phone: "890-123-4567",
    address: "890 Spruce St, Anyburg, USA",
    plate: "VWX234",
    make: "Mazda",
    model: "CX-5",
    dents: [],
  },
  {
    id: "Wo-009",
    customer: "Ivy Wilson",
    email: "ivy@example.com",
    status: "in_progress",
    dateReceived: "9 September 2025",
    dateUpdated: "10 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=9",
    phone: "901-234-5678",
    address: "901 Fir St, Anyville, USA",
    plate: "YZA567",
    make: "Subaru",
    model: "Outback",
    dents: [],
  },
  {
    id: "Wo-010",
    customer: "Jack Taylor",
    email: "jack@example.com",
    status: "waiting_for_inspection",
    dateReceived: "8 September 2025",
    dateUpdated: "9 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=10",
    phone: "012-345-6789",
    address: "012 Willow St, Anycity, USA",
    plate: "BCD890",
    make: "Volkswagen",
    model: "Jetta",
    dents: [],
  },
  {
    id: "Wo-011",
    customer: "Karen Thomas",
    email: "karen@example.com",
    status: "completed",
    dateReceived: "7 September 2025",
    dateUpdated: "8 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=11",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    plate: "EFG123",
    make: "Chevrolet",
    model: "Malibu",
    dents: [],
  },
  {
    id: "Wo-012",
    customer: "Liam Scott",
    email: "liam@example.com",
    status: "follow_up_required",
    dateReceived: "6 September 2025",
    dateUpdated: "7 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=12",
    phone: "234-567-8901",
    address: "234 Elm St, Othertown, USA",
    plate: "HIJ456",
    make: "Ford",
    model: "Fusion",
    dents: [],
  },
  {
    id: "Wo-013",
    customer: "Mia Harris",
    email: "mia@example.com",
    status: "waiting_for_inspection",
    dateReceived: "5 September 2025",
    dateUpdated: "6 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=13",
    phone: "345-678-9012",
    address: "345 Oak St, Sometown, USA",
    plate: "JKL012",
    make: "Chevrolet",
    model: "Malibu",
    dents: [],
  },
  {
    id: "Wo-014",
    customer: "Noah Brooks",
    email: "noah@example.com",
    status: "in_progress",
    dateReceived: "4 September 2025",
    dateUpdated: "5 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=14",
    phone: "456-789-0123",
    address: "456 Pine St, Anycity, USA",
    plate: "MNO345",
    make: "Nissan",
    model: "Altima",
    dents: [],
  },
  {
    id: "Wo-015",
    customer: "Olivia Davis",
    email: "olivia@example.com",
    status: "completed",
    dateReceived: "3 September 2025",
    dateUpdated: "4 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=15",
    phone: "567-890-1234",
    address: "567 Maple St, Anystate, USA",
    plate: "PQR678",
    make: "Hyundai",
    model: "Elantra",
    dents: [],
  },
  {
    id: "Wo-016",
    customer: "Paul Wright",
    email: "paul@example.com",
    status: "waiting_for_inspection",
    dateReceived: "2 September 2025",
    dateUpdated: "3 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=16",
    phone: "678-901-2345",
    address: "678 Cedar St, Anyplace, USA",
    plate: "STU901",
    make: "Kia",
    model: "Soul",
    dents: [],
  },
  {
    id: "Wo-017",
    customer: "Quinn Foster",
    email: "quinn@example.com",
    status: "in_progress",
    dateReceived: "1 September 2025",
    dateUpdated: "2 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=17",
    phone: "789-012-3456",
    address: "789 Birch St, Anycity, USA",
    plate: "VWX234",
    make: "Mazda",
    model: "CX-5",
    dents: [],
  },
  {
    id: "Wo-018",
    customer: "Rachel Green",
    email: "rachel@example.com",
    status: "follow_up_required",
    dateReceived: "31 August 2025",
    dateUpdated: "1 September 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=18",
    phone: "890-123-4567",
    address: "890 Spruce St, Anyburg, USA",
    plate: "YZA567",
    make: "Subaru",
    model: "Outback",
    dents: [],
  },
  {
    id: "Wo-019",
    customer: "Sam Parker",
    email: "sam@example.com",
    status: "completed",
    dateReceived: "30 August 2025",
    dateUpdated: "31 August 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=19",
    phone: "901-234-5678",
    address: "901 Fir St, Anyville, USA",
    plate: "BCD890",
    make: "Volkswagen",
    model: "Jetta",
    dents: [],
  },
  {
    id: "Wo-020",
    customer: "Tina Lopez",
    email: "tina@example.com",
    status: "waiting_for_inspection",
    dateReceived: "29 August 2025",
    dateUpdated: "30 August 2025",
    customerAvatar: "https://i.pravatar.cc/40?img=20",
    phone: "012-345-6789",
    address: "012 Willow St, Anycity, USA",
    plate: "EFG123",
    make: "Chevrolet",
    model: "Malibu",
    dents: [],
  },
];

const shops: Shop[] = [
  {
    id: "#001",
    name: "FixIt Shop",
    owner: "Dana White",
    status: "active",
    address: "123 Main St",
    postalCode: "T3J 4T3",
    contact: "555-123-1234",
    email: "fixit@example.com",
  },
  {
    id: "#002",
    name: "Bright Lights",
    owner: "Chris Evans",
    status: "inactive",
    address: "456 Elm St",
    postalCode: "A2L 3T4",
    contact: "555-567-5678",
    email: "brightlights@example.com",
  },
  {
    id: "#003",
    name: "Plumb Perfect",
    owner: "Alice Johnson",
    status: "active",
    address: "789 Oak St",
    postalCode: "L9M 1A1",
    contact: "555-9012-9012",
    email: "plumbperfect@example.com",
  },
  {
    id: "#004",
    name: "PaintPro",
    owner: "Bob Smith",
    status: "active",
    address: "321 Pine St",
    postalCode: "Q2Q 1A1",
    contact: "555-345-6234",
    email: "paintpro@example.com",
  },
  {
    id: "#005",
    name: "Carpentry Hub",
    owner: "Charlie Brown",
    status: "inactive",
    address: "654 Maple St",
    postalCode: "W1Y 4T3",
    contact: "555-789-0777",
    email: "carpentryhub@example.com",
  },
  {
    id: "#006",
    name: "AC Masters",
    owner: "Grace Lee",
    status: "active",
    address: "159 Birch St",
    postalCode: "Q1W 2X3",
    contact: "555-234-5345",
    email: "acmasters@example.com",
  },
  {
    id: "#007",
    name: "RoofFix",
    owner: "Hank Miller",
    status: "inactive",
    address: "753 Cedar St",
    postalCode: "G5Q 1A1",
    contact: "555-678-6789",
    email: "roofFix@example.com",
  },
  {
    id: "#008",
    name: "GardenWorks",
    owner: "Ivy Wilson",
    status: "active",
    address: "852 Willow St",
    postalCode: "A6S 4T3",
    contact: "555-345-9086",
    email: "gardenworks@example.com",
  },
  {
    id: "#009",
    name: "Window World",
    owner: "Jack Taylor",
    status: "active",
    address: "963 Spruce St",
    postalCode: "A2Q 1A1",
    contact: "555-901-0982",
    email: "windowworld@example.com",
  },
  {
    id: "#010",
    name: "ElectroFix",
    owner: "Eve Adams",
    status: "inactive",
    address: "741 Birch St",
    postalCode: "12345",
    contact: "555-234-7654",
    email: "electrofix@example.com",
  },
  {
    id: "#011",
    name: "SteelWorks",
    owner: "Karen Thomas",
    status: "active",
    address: "258 Cedar St",
    postalCode: "67890",
    contact: "555-678-6789",
    email: "steelworks@example.com",
  },
  {
    id: "#012",
    name: "Power Plumbing",
    owner: "Liam Scott",
    status: "inactive",
    address: "369 Elm St",
    postalCode: "98765",
    contact: "555-789-4560",
    email: "powerplumbing@example.com",
  },
  {
    id: "#013",
    name: "ColorPro Paints",
    owner: "Mia Harris",
    status: "active",
    address: "123 Main St",
    postalCode: "12345",
    contact: "555-123-9084",
    email: "colorpro@example.com",
  },
  {
    id: "#014",
    name: "QuickFix Garage",
    owner: "Noah Brooks",
    status: "inactive",
    address: "456 Elm St",
    postalCode: "67890",
    contact: "555-567-0988",
    email: "quickfix@example.com",
  },
  {
    id: "#015",
    name: "Vision Glass",
    owner: "Olivia Davis",
    status: "active",
    address: "789 Oak St",
    postalCode: "13579",
    contact: "555-901-3452",
    email: "visionglass@example.com",
  },
  {
    id: "#016",
    name: "BuildRight",
    owner: "Paul Wright",
    status: "inactive",
    address: "321 Pine St",
    postalCode: "24680",
    contact: "555-345-8906",
    email: "buildright@example.com",
  },
  {
    id: "#017",
    name: "Pro Roofing",
    owner: "Quinn Foster",
    status: "active",
    address: "654 Maple St",
    postalCode: "98765",
    contact: "555-789-9870",
    email: "proroofing@example.com",
  },
  {
    id: "#018",
    name: "GreenScape",
    owner: "Rachel Green",
    status: "inactive",
    address: "852 Willow St",
    postalCode: "24680",
    contact: "555-345-9086",
    email: "greenscape@example.com",
  },
  {
    id: "#019",
    name: "Elite Auto",
    owner: "Sam Parker",
    status: "active",
    address: "963 Spruce St",
    postalCode: "13579",
    contact: "555-901-9872",
    email: "eliteauto@example.com",
  },
  {
    id: "#020",
    name: "Sunlight Interiors",
    owner: "Tina Lopez",
    status: "inactive",
    address: "741 Birch St",
    postalCode: "12345",
    contact: "555-234-8765",
    email: "sunlightinteriors@example.com",
  },
];

// --- Fake API methods --- //
export const fakeApi = {
  getUsers: async (): Promise<(User & { repairShop: string })[]> => {
    await new Promise((res) => setTimeout(res, 500));
    return users.map((u) => {
      const shop = shops.find((s) => s.owner === u.name);
      return { ...u, repairShop: shop?.name || "—" };
    });
  },
  updateUser: async (updatedUser: User): Promise<User> => {
    await new Promise((res) => setTimeout(res, 300));

    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    } else {
      throw new Error("User not found");
    }
  },

  getWorkOrders: async (): Promise<WorkOrder[]> => {
    await new Promise((res) => setTimeout(res, 500));
    return workOrders.map((wo) => {
      const user = users.find((u) => u.name === wo.customer);
      return { ...wo, customerAvatar: user?.avatar };
    });
  },
  getShops: async (): Promise<Shop[]> => {
    await new Promise((res) => setTimeout(res, 500));
    return shops;
  },
  updateShop: async (updatedShop: Shop): Promise<Shop> => {
    await new Promise((res) => setTimeout(res, 300));

    const index = shops.findIndex((s) => s.id === updatedShop.id);
    if (index !== -1) {
      shops[index] = { ...shops[index], ...updatedShop };
      return shops[index];
    } else {
      throw new Error("Shop not found");
    }
  },
  getClaim: async (): Promise<Claim> => {
    await new Promise((res) => setTimeout(res, 300));
    return mockClaim;
  },
  getJobs: async (): Promise<Job[]> => {
    await new Promise((res) => setTimeout(res, 300));
    return jobs;
  },
  updateJob: async (updatedJob: Job): Promise<Job> => {
    await new Promise((res) => setTimeout(res, 300));

    const index = jobs.findIndex((j) => j.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updatedJob };
      if (typeof window !== "undefined") {
        localStorage.setItem("jobs", JSON.stringify(jobs));
      }
      return jobs[index];
    } else {
      throw new Error("Job not found");
    }
  },
};

// --- Mock Claim --- //
export const mockClaim: Claim = {
  InsuranceClaimed: true,
  ClaimApproved: false,
  Claim: "#123456",
  Note: "Customer to provide additional documents.",
};

// ✅ Optional: remove old fetchClaim or keep as alias
export const fetchClaim = (): Claim => mockClaim;

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

type DataGridRow = {
  id: number;
  image: string;
  size: string;
  mode: DefectMode;
  estCharge: number;
};
export type { DataGridRow };

export function toDataGridRows(defects: DefectQuote[]): DataGridRow[] {
  return defects.map((d) => ({
    id: d.ID,
    image: d.Image,
    size: d.Size,
    mode: d.Mode,
    estCharge: d.EstCharge,
  }));
}
