    "use client";

    import { useState } from "react";
    import Image from "next/image";
    import {
    IconButton,
    Box,
    Typography,
    Chip,
    Drawer,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    TextField,
    useTheme,
    } from "@mui/material";
    import {
    Bell,
    Shield,
    Edit,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Clock,
    FileText,
    X,
    Lock,
    LogOut,
    Settings,
    IdCard,
    } from "lucide-react";

    export default function UserProfile({
    open,
    onClose,
    }: {
    open: boolean;
    onClose: () => void;
    }) {
    const [editMode, setEditMode] = useState(false);
    const theme = useTheme();

    const userData = {
        name: "Himanshi Punj",
        role: "Admin",
        employeeId: "EMP-2024-1001",
        email: "himanshi.punj@company.com",
        phone: "+1 (416) 555-9083",
        department: "Claims & Operations Management",
        location: "Toronto, Canada",
        joinedDate: "March 12, 2023",
        avatar: "/admin.jpg", // ✅ local image from /public
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
        case "admin":
            return {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            };
        case "bodyman":
            return {
            bgcolor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            };
        case "adjuster":
            return {
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            };
        default:
            return {
            bgcolor: theme.palette.grey[600],
            color: "#fff",
            };
        }
    };

    const stats = [
        { label: "Active Claims", value: "32", icon: <FileText size={18} /> },
        { label: "Pending Reviews", value: "11", icon: <Clock size={18} /> },
        { label: "Completed", value: "210", icon: <Shield size={18} /> },
        { label: "This Month", value: "54", icon: <Calendar size={18} /> },
    ];

    return (
        <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
            paper: {
            sx: {
                width: { xs: "100%", sm: 420 },
                background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                overflowY: "auto", // ✅ allows scroll
            },
            },
        }}
        >
        {/* Close button */}
        <IconButton
            onClick={onClose}
            sx={{
            position: "absolute",
            right: 16,
            top: 16,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "white" },
            }}
        >
            <X size={18} />
        </IconButton>

        {/* Header background */}
        <Box
            sx={{
            height: 200, // ✅ adjusted height for avatar placement
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
        />

        {/* Main content */}
        <Box sx={{ px: 3, mt: -6, position: "relative", pb: 3 }}>
            {/* Avatar + edit button */}
            <Box
            sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                mb: 2,
            }}
            >
            {/* ✅ Optimized Next.js Image Avatar */}
            <Box
    sx={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        overflow: "hidden",
        border: "4px solid white",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        backgroundColor: "white",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    }}
    >
    <Image
        src={userData.avatar}
        alt={userData.name}
        fill
        priority
        style={{
        objectFit: "cover",
        objectPosition: "center center", // ✅ ensures face is centered
        }}
    />
    </Box>




            <Box sx={{ flex: 1, pb: 1 }}>
                <Button
                variant="outlined"
                size="small"
                startIcon={<Edit size={15} />}
                onClick={() => setEditMode(!editMode)}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    color: editMode ? theme.palette.primary.main : undefined,
                    borderColor: editMode ? theme.palette.primary.main : undefined,
                    bgcolor: "white",
                    fontWeight: 500,
                }}
                >
                {editMode ? "Save" : "Edit"}
                </Button>
            </Box>
            </Box>

            {editMode ? (
            <TextField
                fullWidth
                defaultValue={userData.name}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
            />
            ) : (
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {userData.name}
            </Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            <Chip
                label={userData.role}
                size="small"
                sx={{ ...getRoleColor(userData.role), fontWeight: 600 }}
            />
            <Chip
                label={userData.employeeId}
                size="small"
                variant="outlined"
                sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                }}
            />
            </Box>

            <Typography variant="body2" color="text.secondary">
            {userData.department}
            </Typography>

            {/* Stats */}
            <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                justifyContent: "space-between",
                my: 3,
            }}
            >
            {stats.map((stat) => (
                <Card
                key={stat.label}
                sx={{
                    flex: "1 1 48%",
                    background: theme.palette.background.paper,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                }}
                >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Box sx={{ color: theme.palette.primary.main, mb: 0.5 }}>
                    {stat.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
                    {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                    {stat.label}
                    </Typography>
                </CardContent>
                </Card>
            ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Contact Info */}
            <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
            >
            Contact Information
            </Typography>
            <List sx={{ py: 0 }}>
            {[
                { icon: <Mail size={18} />, label: "Email", value: userData.email },
                { icon: <Phone size={18} />, label: "Phone", value: userData.phone },
                { icon: <MapPin size={18} />, label: "Location", value: userData.location },
                { icon: <Briefcase size={18} />, label: "Department", value: userData.department },
                { icon: <Calendar size={18} />, label: "Joined", value: userData.joinedDate },
                { icon: <IdCard size={18} />, label: "Employee ID", value: userData.employeeId },
            ].map((item) => (
                <ListItem key={item.label} sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                    primary={item.label}
                    secondary={item.value}
                    slotProps={{
                    primary: { variant: "caption", color: "text.secondary" },
                    secondary: { variant: "body2", color: "text.primary" },
                    }}
                />
                </ListItem>
            ))}
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Preferences */}
            <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}
            >
            Preferences
            </Typography>
            <List sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                <Bell size={18} />
                </ListItemIcon>
                <ListItemText
                primary="Email Notifications"
                secondary="Receive claim updates via email"
                slotProps={{
                    primary: { variant: "body2" },
                    secondary: { variant: "caption" },
                }}
                />
                <Switch defaultChecked />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                <Bell size={18} />
                </ListItemIcon>
                <ListItemText
                primary="SMS Alerts"
                secondary="Get urgent claim notifications"
                slotProps={{
                    primary: { variant: "body2" },
                    secondary: { variant: "caption" },
                }}
                />
                <Switch />
            </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Account Actions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
                variant="outlined"
                startIcon={<Lock size={16} />}
                fullWidth
                sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderColor: theme.palette.divider,
                }}
            >
                Change Password
            </Button>
            <Button
                variant="outlined"
                startIcon={<Settings size={16} />}
                fullWidth
                sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderColor: theme.palette.divider,
                }}
            >
                Account Settings
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<LogOut size={16} />}
                fullWidth
                sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                }}
            >
                Sign Out
            </Button>
            </Box>
        </Box>
        </Drawer>
    );
    }
