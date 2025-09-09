import { WorkOrder, WorkOrderStatus } from "../types/workOrder";

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
    },
];

// Mock API function
export function fetchWorkOrders(): Promise<WorkOrder[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockWorkOrders);
        }, 500); // simulate network delay
    });
}