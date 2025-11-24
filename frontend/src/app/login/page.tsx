"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { AppButton } from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";

export default function HavenzsureLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      // AuthContext will handle redirect to /dashboard
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f3e7ff 0%, #faf5ff 50%, #eff6ff 100%)",
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome to Havenzsure 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please sign in to access your insurance dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Email */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "action.hover",
                    borderRadius: 2,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "action.hover",
                    borderRadius: 2,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            {/* Remember Me */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={loading}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": {
                        color: "primary.main",
                      },
                    }}
                  />
                }
                label="Remember me"
              />
            </Box>

            {/* Login Button */}
            <AppButton
              type="submit"
              fullWidth
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Log In"}
            </AppButton>
          </Stack>
        </form>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          Contact your administrator if you need help accessing your account
        </Typography>
      </Container>
    </Box>
  );
}
