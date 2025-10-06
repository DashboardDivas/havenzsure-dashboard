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
  Paper,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { AppButton } from "@/components/ui/Buttons";
import { useRouter } from "next/navigation";

export default function HavenzsureLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt", { email, password, remember });

    // ✅ Simulate successful login
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
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

        {/* Demo Credentials */}
        <Paper
          sx={{
            backgroundColor: "rgba(124, 58, 237, 0.05)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2" textAlign="center">
            <Box component="span" color="text.secondary">
              Email:
            </Box>{" "}
            <Box component="span" color="primary.main">
              admin@havenzsure.com
            </Box>{" "}
            /{" "}
            <Box component="span" color="text.secondary">
              Pass:
            </Box>{" "}
            <Box component="span" color="primary.main">
              admin
            </Box>
          </Typography>
        </Paper>

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
              endIcon={<ArrowForward />}
            >
              Log In
            </AppButton>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
