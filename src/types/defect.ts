export enum DefectMode {
  Fixed = "Fixed",
  Skip = "Skip",
}

export interface DefectQuote {
  ID: number;
  Image: string;
  Size: string;
  Mode: DefectMode;
  "Est.Charge": number;
}

export interface RepairSummary {
  "Repair Shop": string;
  "Technician Name": string;
  "Pre-Authorized Dispatch": string;
  mockDefectQuotes: DefectQuote[];
}
