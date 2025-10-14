"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ChevronDown } from "lucide-react"
import StatusChip from "@/components/ui/StatusChip"
import { StatusTab } from "@/components/ui/Tabs"
import { Container, Box } from "@mui/material"

// --- Mock Data 
const workOrderData = [
  { id: "WO-010", status: "Waiting for Inspection", dateReceived: "Sep 03 2025", dateUpdate: "Sep 03 2025", firstName: "An-Ni", lastName: "Huang", email: "anni.huang@example.com", phone: "(403) 555-1827", vin: "1HGCM82633A123456" },
  { id: "WO-009", status: "Waiting for Inspection", dateReceived: "Sep 01 2025", dateUpdate: "Sep 01 2025", firstName: "Chen", lastName: "Li", email: "chen.li@example.com", phone: "(587) 555-9362", vin: "2T1BURHE0FC987654" },
  { id: "WO-008", status: "In Progress", dateReceived: "Aug 30 2025", dateUpdate: "Aug 31 2025", firstName: "Daisy", lastName: "Di", email: "daisy.di@example.com", phone: "(825) 555-4471", vin: "3FAHP0HA6AR765432" },
  { id: "WO-007", status: "In Progress", dateReceived: "Aug 25 2025", dateUpdate: "Aug 31 2025", firstName: "Himanshi", lastName: "Punj", email: "himanshi@example.com", phone: "(403) 555-6029", vin: "5YJ3E1EA7KF123987" },
  { id: "WO-006", status: "Follow Up Required", dateReceived: "Aug 20 2025", dateUpdate: "Aug 25 2025", firstName: "Jason", lastName: "Wang", email: "jason.wang@example.com", phone: "(587) 555-8810", vin: "JH4KA8260MC008321" },
  { id: "WO-005", status: "Follow Up Required", dateReceived: "Aug 15 2025", dateUpdate: "Aug 25 2025", firstName: "Michael", lastName: "Johnson", email: "michael.j@example.com", phone: "(403) 555-7741", vin: "1N4AL11D75C109876" },
  { id: "WO-004", status: "Completed", dateReceived: "Aug 10 2025", dateUpdate: "Aug 12 2025", firstName: "Sophia", lastName: "Davis", email: "sofia.d@example.com", phone: "(825) 555-2285", vin: "4T1BF1FK1GU321654" },
  { id: "WO-003", status: "Completed", dateReceived: "Aug 01 2025", dateUpdate: "Aug 03 2025", firstName: "Olivia", lastName: "Martinez", email: "olivia.m@example.com", phone: "(403) 555-9822", vin: "2C3KA63H76H785321" },
  { id: "WO-002", status: "Completed", dateReceived: "Aug 01 2025", dateUpdate: "Aug 03 2025", firstName: "Emily", lastName: "Brown", email: "emily.b@example.com", phone: "(587) 555-1143", vin: "WAUZZZ8K4DA098765" },
  { id: "WO-001", status: "Completed", dateReceived: "Aug 01 2025", dateUpdate: "Aug 03 2025", firstName: "Daniel", lastName: "Smith", email: "dan.smith@example.com", phone: "(825) 555-4428", vin: "5NPEB4AC4CH654321" },
]

const statusMapping = {
  all: "All Status",
  waiting: "Waiting for Inspection",
  progress: "In Progress",
  followup: "Follow Up Required",
  completed: "Completed",
};

function getStatusType(status: string): StatusType {
  switch (status) {
    case "Waiting for Inspection": return "waiting-for-inspection";
    case "In Progress": return "in-progress";
    case "Follow Up Required": return "follow-up-required";
    case "Completed": return "completed";
    default: return "inactive";
  }
}

export function WorkOrdersTable() {
  const [activeFilter, setActiveFilter] = useState("all");

  const statusCounts = {
    all: workOrderData.length,
    waiting: workOrderData.filter((i) => i.status === "Waiting for Inspection").length,
    progress: workOrderData.filter((i) => i.status === "In Progress").length,
    followup: workOrderData.filter((i) => i.status === "Follow Up Required").length,
    completed: workOrderData.filter((i) => i.status === "Completed").length,
  };

  const filteredData =
    activeFilter === "all"
      ? workOrderData
      : workOrderData.filter((i) => i.status === statusMapping[activeFilter as keyof typeof statusMapping]);

  return (
    <div className="w-full mt-4">
      <Card className="border-2 border-blue-400">
        <CardContent className="p-0">
          {/* Status Tabs */}
          <Box sx={{ px: 3, pt: 2 }}>
            <StatusTab activeStatus={activeFilter} onStatusChange={setActiveFilter} statusCounts={statusCounts} />
          </Box>

          {/* Scrollable Table */}
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table className="min-w-[1000px] table-auto">
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-semibold text-gray-700">
                    WorkOrder ID <ChevronDown className="h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status <ChevronDown className="h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Date Received</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date Update</TableHead>
                  <TableHead className="font-semibold text-gray-700">First Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Last Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden lg:table-cell whitespace-nowrap">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden xl:table-cell whitespace-nowrap">VIN</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((wo, index) => (
                  <TableRow key={wo.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium text-sm">{wo.id}</TableCell>
                    <TableCell>
                      <StatusChip status={getStatusType(wo.status)}>{wo.status}</StatusChip>
                    </TableCell>
                    <TableCell className="text-sm">{wo.dateReceived}</TableCell>
                    <TableCell className="text-sm">{wo.dateUpdate}</TableCell>
                    <TableCell className="text-sm">{wo.firstName}</TableCell>
                    <TableCell className="text-sm">{wo.lastName}</TableCell>
                    <TableCell className="text-blue-600 text-sm hidden lg:table-cell whitespace-nowrap">{wo.email}</TableCell>
                    <TableCell className="text-sm hidden md:table-cell">{wo.phone}</TableCell>
                    <TableCell className="font-mono text-xs hidden xl:table-cell whitespace-nowrap">{wo.vin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}