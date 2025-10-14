export enum WorkOrderStatus {
    WaitingForInspection = "Waiting for Inspection",
    InProgress = "In Progress",
    FollowUpRequired = "Follow Up Required",
    Completed = "Completed",
    WaitingForInformation = "Waiting for Information",
}

export interface WorkOrder {
    WorkOrderID: string;
    UserID?: string;
    Status: WorkOrderStatus;
    DateReceived: string;
    DateUpdate: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    VIN: string;

     // Customer Info
  Address: string;
  City: string;
  State: string;
  ZIP: string;

  // Vehicle Info
  Make: string;
  Model: string;
  BodyStyle: string;
  Year: string;
  Color: string;
  DamageDate: string;
  PlateNumber: string;

}