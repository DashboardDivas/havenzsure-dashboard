"use client";

import { useParams } from "next/navigation";
import { fetchDefectQuotes } from "@/lib/fakeApi";
import Button from "@/components/ui/PrimaryButton";
import { fetchWorkOrders } from "@/lib/fakeApi";

export default function OverviewTab() {
  const params = useParams();
  const workOrderId = params.id as string;
  const workOrders = fetchWorkOrders();
  const workOrder = workOrders.find((wo) => wo.WorkOrderID === workOrderId)!!;
  const defectQuotes = fetchDefectQuotes();

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-600">
          Work Order #{workOrder.WorkOrderID}
        </h2>
        <div className="flex gap-3">
          <Button>Reassign</Button>
          {/* Special Delete button with red theme */}
          <Button>
            <span className="text-red-500">Delete</span>
          </Button>
          <Button>Mark Complete</Button>
        </div>
      </div>

      {/* Top Info Section */}
      <div className="grid grid-cols-2 gap-6 border rounded-lg p-4 bg-white shadow-sm">
        {/* Customer Info */}
        <div>
          <h3 className="font-semibold mb-3 text-blue-500 border-b pb-1">
            Customer Info
          </h3>
          <div className="space-y-1">
            <p>
              <span className="font-bold">Name:</span>{" "}
              {workOrder.FirstName} {workOrder.LastName}
            </p>
            <p>
              <span className="font-bold">Phone:</span> {workOrder.Phone}
            </p>
            <p>
              <span className="font-bold">Email:</span> {workOrder.Email}
            </p>
            <p>
              <span className="font-bold">Address:</span>{" "}
              {workOrder.Address}, {workOrder.City}, {workOrder.State}{" "}
              {workOrder.ZIP}
            </p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div>
          <h3 className="font-semibold mb-3 text-blue-500 border-b pb-1">
            Vehicle Info
          </h3>
          <div className="space-y-1">
            <p>
              <span className="font-bold">Plate:</span>{" "}
              {workOrder.PlateNumber}
            </p>
            <p>
              <span className="font-bold">Make:</span> {workOrder.Make}
            </p>
            <p>
              <span className="font-bold">Model:</span> {workOrder.Model}
            </p>
            <p>
              <span className="font-bold">Year:</span> {workOrder.Year}
            </p>
            <p>
              <span className="font-bold">VIN:</span> {workOrder.VIN}
            </p>
            <p>
              <span className="font-bold">Color:</span> {workOrder.Color}
            </p>
            <p>
              <span className="font-bold">Body Style:</span>{" "}
              {workOrder.BodyStyle}
            </p>
          </div>
        </div>
      </div>

      {/* Media & AI Scan + Dent Details */}
      <div className="grid grid-cols-2 gap-6">
        {/* Media & AI Scan */}
        <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
          <h3 className="font-semibold mb-2 text-blue-500 border-b pb-1">
            Media & AI Scan
          </h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Upload Photos
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
              Trigger AI Scan
            </button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">AI Result</h4>
            <div className="border rounded-lg h-28 flex items-center justify-center bg-gray-50">
              <span className="text-gray-400">[AI Image Preview]</span>
            </div>
          </div>
        </div>

        {/* Dent Details */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-2 text-blue-500 border-b pb-1">
            Dent Details
          </h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Severity</th>
                <th className="p-2 border">Estimated Charge ($)</th>
              </tr>
            </thead>
            <tbody>
              {defectQuotes.map((quote) => (
                <tr key={quote.ID} className="hover:bg-gray-50">
                  <td className="p-2 border">{quote.Image}</td>
                  <td className="p-2 border">{quote.Mode}</td>
                  <td className="p-2 border font-medium">
                    ${quote.EstCharge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
