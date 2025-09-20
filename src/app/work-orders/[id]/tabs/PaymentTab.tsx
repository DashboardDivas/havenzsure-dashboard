
export default function PaymentTab() {
  return (
    <div className="p-4 text-gray-800">
      <h2 className="text-lg font-semibold mb-4">Payment & Dispatch</h2>

      <form className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Select Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-1">
            Select Time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            step="60"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Service Location
          </label>
          <select
            id="location"
            name="location"
            defaultValue=""
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="paid" className="text-sm font-medium">
            Payment Completed
          </label>
        </div>
      </form>
    </div>
  );
}