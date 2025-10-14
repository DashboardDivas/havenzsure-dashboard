'use client';

import { useState } from "react";

export default function PaymentTab() {
  const [note, setNote] = useState("This is the payment note.");
  return (
    <div className="p-4">
      <div className="bg-blue-100 text-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Payment & Dispatch</h2>

        <form className="space-y-4 max-w-2xl">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1 text-blue-900">
              Select Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1 text-blue-900">
              Select Time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              step="60"
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1 text-blue-900">
              Service Location
            </label>
            <select
              id="location"
              name="location"
              defaultValue=""
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Unselected</option>
              <option value="Calgary">Calgary</option>
              <option value="Vancouver">Vancouver</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="paid"
              name="paid"
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-blue-200 text-blue-600 focus:ring-blue-400"
            />
            <label htmlFor="paid" className="text-sm font-medium text-blue-900">
              Payment Completed
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="payment-note" className="text-sm font-medium text-blue-900">
              Note
            </label>
            <textarea
              id="payment-note"
              className="w-full rounded border border-blue-200 px-3 py-2 text-sm bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              onChange={(e) => setNote(e.target.value)}
              value={note}
              placeholder="Enter note"
            />
          </div>
        </form>
      </div>
    </div>
  );
}