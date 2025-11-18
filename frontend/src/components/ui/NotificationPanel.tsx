"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  useTheme,
  Button,
  Chip,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface NotificationItem {
  id: number;
  title: string;
  detail: string;
  time: string;
  type: "work_order" | "customer" | "system";
  isRead: boolean;
}

export default function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "New Work Order Assigned",
      detail: "WO-2411 has been assigned to technician John.",
      time: "2 min ago",
      type: "work_order",
      isRead: false,
    },
    {
      id: 2,
      title: "Customer Updated",
      detail: "Customer info for Jane Doe has been updated.",
      time: "1 hour ago",
      type: "customer",
      isRead: false,
    },
    {
      id: 3,
      title: "System Health",
      detail: "All services running normally.",
      time: "3 hours ago",
      type: "system",
      isRead: true,
    },
    {
      id: 4,
      title: "Work Order Completed",
      detail: "WO-2398 has been marked as completed.",
      time: "5 hours ago",
      type: "work_order",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "work_order":
        return <AssignmentIcon />;
      case "customer":
        return <PersonIcon />;
      case "system":
        return <CheckCircleIcon />;
      default:
        return <NotificationsActiveIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "work_order":
        return theme.palette.primary.main;
      case "customer":
        return theme.palette.success.main;
      case "system":
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          backgroundColor: theme.palette.background.paper,
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" fontWeight={600}>
            Activity Log
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              color="primary"
              sx={{
                height: 22,
                minWidth: 22,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <Box sx={{ px: 2.5, py: 1.5, backgroundColor: theme.palette.background.default }}>
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={markAllAsRead}
            sx={{ textTransform: "none" }}
          >
            Mark all as read
          </Button>
        </Box>
      )}

      {/* Log List */}
      {notifications.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 3,
            textAlign: "center",
          }}
        >
          <NotificationsActiveIcon
            sx={{ fontSize: 64, opacity: 0.3, mb: 2 }}
          />
          <Typography variant="h6" gutterBottom sx={{ opacity: 0.7 }}>
            All caught up!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            You have no notifications at this time.
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <Fade in key={notification.id}>
              <Box>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 2.5,
                    position: "relative",
                    backgroundColor: !notification.isRead
                      ? theme.palette.action.hover
                      : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                      "& .notification-actions": {
                        opacity: 1,
                      },
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: getNotificationColor(notification.type),
                        color: "#fff",
                        width: 44,
                        height: 44,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ pr: 1 }}
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography fontWeight={600} sx={{ fontSize: 15, flex: 1 }}>
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{
                            display: "block",
                            opacity: 0.75,
                            mb: 0.75,
                            lineHeight: 1.5,
                          }}
                          variant="body2"
                        >
                          {notification.detail}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />

                  {/* Action Buttons */}
                  <Box
                    className="notification-actions"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: 1,
                        "&:hover": {
                          backgroundColor: theme.palette.error.light,
                          color: theme.palette.error.contrastText,
                        },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider component="li" />
              </Box>
            </Fade>
          ))}
        </List>
      )}
    </Drawer>
  );
}
