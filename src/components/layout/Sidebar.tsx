'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import CircleIcon from '@mui/icons-material/Circle';

export const drawerWidth = 240;

const ICONS = {
  Dashboard: DashboardIcon,
  Assignment: AssignmentIcon,
  Build: BuildIcon,
  History: HistoryIcon,
  People: PeopleIcon,
  Store: StoreIcon,
  Settings: SettingsIcon,
  Help: HelpIcon,
  Circle: CircleIcon,
} as const;

type IconKey = keyof typeof ICONS;

type NavItem = { label: string; path: string; icon?: IconKey };

export default function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
      aria-label="primary navigation"
    >
      <Toolbar />
      <List>
        {items.map(({ label, path, icon }) => {
          const Icon = ICONS[(icon as IconKey) ?? 'Circle'];
          <ListItemIcon><Icon /></ListItemIcon>

          const selected = pathname?.startsWith(path);
          return (
            <Link key={path} href={path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Tooltip title={label} placement="right" enterDelay={500}>
                <ListItemButton selected={!!selected} aria-current={selected ? 'page' : undefined}>
                  <ListItemIcon>{Icon ? <Icon /> : null}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </Tooltip>
            </Link>
          );
        })}
      </List>
    </Drawer>
  );
}
