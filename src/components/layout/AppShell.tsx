'use client';

import * as React from 'react';
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import Sidebar, { drawerWidth } from './Sidebar';
import { NAV_ITEMS } from '@/config/routes';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSidebar = pathname === '/' || pathname?.startsWith('/login');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            HavenzSure Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {!hideSidebar && <Sidebar items={NAV_ITEMS} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
