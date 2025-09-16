"use client";

import React, { useState } from "react";
import {
  Button,
  Card as MUICard,
  CardContent,
  TextField,
  InputAdornment,
  IconButton, // 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    { name: "Mon", jobs: 4 },
    { name: "Tue", jobs: 6 },
    { name: "Wed", jobs: 2 },
    { name: "Thu", jobs: 7 },
    { name: "Fri", jobs: 5 },
  ];

  return (
    <div className="p-8 space-y-8 bg-blue-100 min-h-screen rounded-2xl">
      {/*  Navbar */}
      <div className="flex items-center justify-between w-full bg-gray-100 px-6 py-3 rounded-2xl shadow-sm">
        {/* Search */}
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
            style: { borderRadius: "12px", background: "white" },
          }}
          className="w-full max-w-md"
        />

        {/* Date, Notification, Profile */}
        <div className="flex items-center gap-6">
          <span className="text-gray-600 text-sm font-medium">
            16 September 2025, 12:00 PM
          </span>

          <IconButton className="bg-white shadow-md rounded-full">
            <NotificationsIcon className="text-gray-600" />
          </IconButton>

          <img
            src="/images/himanshi.png"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300"
          />
        </div>
      </div>

      {/* Top greeting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MUICard className="col-span-2 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl">
          <CardContent>
            <p className="text-blue-500">Dashboard Overview</p>
            <h1 className="text-3xl text-blue-500 font-extrabold">
              Hello Himanshi 👋
            </h1>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-violet-300 rounded-xl p-4 text-center">
                <p className="text-white text-sm">Total Work Orders</p>
                <h2 className="text-3xl font-bold">120</h2>
                <p className="text-white text-xs">Per Month</p>
              </div>
              <div className="bg-violet-300 rounded-xl p-4 text-center">
                <p className="text-white text-sm">Completed Jobs</p>
                <h2 className="text-3xl font-bold text-green-400">112</h2>
                <p className="text-white text-xs">Per Month</p>
              </div>
            </div>
          </CardContent>
        </MUICard>

        {/* Circular goal progress */}
        <MUICard className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center">
            <h2 className="text-lg font-semibold">Pending Jobs</h2>
            <div className="relative w-32 h-32 flex items-center justify-center mt-4">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#333"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#facc15"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(8 / 120) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-yellow-400">
                8
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">Pending This Week</p>
          </CardContent>
        </MUICard>
      </div>

      {/* Chart */}
      <MUICard className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Jobs This Week</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
                <YAxis tick={{ fill: "#aaa" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    background: "rgba(30,30,30,0.9)",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </MUICard>

      {/* Recent activity */}
      <MUICard className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Recent Work Orders</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <TableRow id="WO-101" status="Pending" date="2025-09-10" />
              <TableRow id="WO-102" status="Completed" date="2025-09-11" />
              <TableRow id="WO-103" status="In Progress" date="2025-09-12" />
            </tbody>
          </table>
        </CardContent>
      </MUICard>

      {/* Quick actions + Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MUICard className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-3">
              <PrimaryButton>Add a New work order</PrimaryButton>
              <PrimaryButton>Add User</PrimaryButton>
              <PrimaryButton>View Jobs</PrimaryButton>
            </div>
          </CardContent>
        </MUICard>

      </div>
    </div>
  );
}

/* TableRow with colorful status badges */
function TableRow({
  id,
  status,
  date,
}: {
  id: string;
  status: string;
  date: string;
}) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Completed: "bg-green-500/20 text-green-400",
    "In Progress": "bg-blue-500/20 text-blue-400",
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
      <td className="p-3 font-medium">{id}</td>
      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="p-3 text-gray-300">{date}</td>
    </tr>
  );
}
