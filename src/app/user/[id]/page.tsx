"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, Card, CardContent } from "@mui/material";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopNumber: string;
  status: "Active" | "Inactive";
  avatar?: string;
};

// Normally, you would fetch this from an API
const initialUsers: User[] = [
  { id: "U0001", name: "Himanshi Punj", email: "himanshi@example.com", role: "Admin", shopNumber: "S001", status: "Active", avatar: "/images/himanshi.png" },
  { id: "U0002", name: "Daisy Di", email: "daisy@example.com", role: "Adjustor", shopNumber: "S002", status: "Active", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "U0003", name: "Chen Li", email: "chen@example.com", role: "Bodyman", shopNumber: "S003", status: "Active", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "U0004", name: "An-Ni Huang", email: "anni@example.com", role: "Technician", shopNumber: "S004", status: "Active", avatar: "https://i.pravatar.cc/150?img=25" },
  { id: "U0005", name: "Jason Wang", email: "jason@example.com", role: "Bodyman", shopNumber: "S005", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=35" },
];

export default function UserDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const foundUser = initialUsers.find((u) => u.id === id);
    if (!foundUser) {
      router.push("/"); // Redirect if user not found
    } else {
      setUser(foundUser);
    }
  }, [id, router]);

  if (!user) return null;

  return (
    <div className="p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => router.push("/user")}
      >
        Back
      </button>

      <Card className="max-w-md mx-auto shadow">
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 80, height: 80 }}
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex space-x-4">
            <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm">
              {user.role}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                user.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {user.status}
            </span>
          </div>
          <p className="text-gray-500">Repair Shop: {user.shopNumber}</p>
        </CardContent>
      </Card>
    </div>
  );
}
