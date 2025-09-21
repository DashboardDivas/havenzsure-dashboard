'use client';

import { useEffect, useState } from 'react';
import { fetchClaim } from '@/lib/fakeApi';
import { Claim } from '@/types/claim';

export default function ClaimTab() {
  const [claim, setClaim] = useState<Claim | null>(null);

  useEffect(() => {
    const data = fetchClaim();
    setClaim(data);
  }, []);

  if (!claim) {
    return (
      <div className="p-4">
        <div className="bg-blue-100 text-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold">Claim</h2>
          <p className="text-gray-400">Loading claim data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Claim</h2>

        <div className="space-y-6 max-w-2xl">
          {/* Insurance Claimed - checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="insurance-claimed"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
              checked={claim['Insurance Claimed']}
              onChange={(e) =>
                setClaim((prev: Claim | null) =>
                  prev ? { ...prev, ['Insurance Claimed']: e.target.checked } : prev
                )
              }
            />
            <label htmlFor="insurance-claimed" className="text-sm font-medium text-gray-700">
              Insurance Claimed
            </label>
          </div>

          {/* Claim Approved - select yes/no */}
          <div className="flex flex-col gap-1">
            <label htmlFor="claim-approved" className="text-sm font-medium text-gray-700">
              Claim Approved
            </label>
            <select
              id="claim-approved"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={claim['Claim Approved'] ? 'yes' : 'no'}
              onChange={(e) =>
                setClaim((prev: Claim | null) =>
                  prev ? { ...prev, ['Claim Approved']: e.target.value === 'yes' } : prev
                )
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Claim - text input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="claim-text" className="text-sm font-medium text-gray-700">
              Claim
            </label>
            <input
              id="claim-text"
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={claim.Claim}
              onChange={(e) =>
                setClaim((prev: Claim | null) => (prev ? { ...prev, Claim: e.target.value } : prev))
              }
              placeholder="Enter claim details"
            />
          </div>

          {/* Note - textarea */}
          <div className="flex flex-col gap-1">
            <label htmlFor="claim-note" className="text-sm font-medium text-gray-700">
              Note
            </label>
            <textarea
              id="claim-note"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              value={claim.Note}
              onChange={(e) =>
                setClaim((prev: Claim | null) => (prev ? { ...prev, Note: e.target.value } : prev))
              }
              placeholder="Enter note"
            />
          </div>
        </div>
      </div>
    </div>
  );
}