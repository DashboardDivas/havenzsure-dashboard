"use client";
import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopNumber: string;
  status: "Active" | "Inactive";
  avatar?: string;
};

const initialUsers: User[] = [
  { id: "U0001", name: "Himanshi Punj", email: "himanshi@example.com", role: "Admin", shopNumber: "S001", status: "Active", avatar: "/images/himanshi.png" },
  { id: "U0002", name: "Daisy Di", email: "daisy@example.com", role: "Adjustor", shopNumber: "S002", status: "Active", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "U0003", name: "Chen Li", email: "chen@example.com", role: "Bodyman", shopNumber: "S003", status: "Active", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "U0004", name: "An-Ni Huang", email: "anni@example.com", role: "Technician", shopNumber: "S004", status: "Active", avatar: "https://i.pravatar.cc/150?img=25" },
  { id: "U0005", name: "Jason Wang", email: "jason@example.com", role: "Bodyman", shopNumber: "S005", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=35" },
  { id: "U0006", name: "Maria Garcia", email: "maria@example.com", role: "Technician", shopNumber: "S006", status: "Active", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: "U0007", name: "Liam Smith", email: "liam@example.com", role: "Technician", shopNumber: "S007", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=55" },
  { id: "U0008", name: "Olivia Brown", email: "olivia@example.com", role: "Technician", shopNumber: "S008", status: "Active", avatar: "https://i.pravatar.cc/150?img=65" },
  { id: "U0009", name: "Noah Johnson", email: "noah@example.com", role: "Technician", shopNumber: "S009", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=75" },
  { id: "U0010", name: "Ashna Walia", email: "ashna@example.com", role: "Technician", shopNumber: "S010", status: "Active", avatar: "https://i.pravatar.cc/150?img=85" }
];

export default function UserList() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAction = (action: string) => {
    if (!selectedUser) return;

    if (action === "view") {
      // Navigate to details page
      router.push(`/user/${selectedUser.id}`);
    } else if (action === "edit") {
      // Navigate to edit page
      router.push(`/user/${selectedUser.id}/edit`);
    } else if (action === "delete") {
      // Simple delete in state
      if (confirm(`Are you sure you want to delete ${selectedUser.name}?`)) {
        setUsers(users.filter((u) => u.id !== selectedUser.id));
      }
    }
    handleMenuClose();
  };

  const handleRowClick = (id: string) => {
    router.push(`/user/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User List Preview</h1>
      <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Repair Shop #</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className="hover:bg-gray-50 cursor-pointer border-t"
              >
                <td className="p-3">{user.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium text-gray-900 text-[15px]">
                        {user.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.role}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      user.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">#{user.shopNumber}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction("view")} sx={{ color: "blue" }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: "blue" }} />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem
          onClick={() => handleAction("edit")}
          sx={{ color: "orange" }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: "orange" }} />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleAction("delete")}
          sx={{ color: "red" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
