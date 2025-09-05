'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import * as Icons from '@mui/icons-material';

export const drawerWidth = 240;

type NavItem = { label: string; path: string; icon?: keyof typeof Icons };

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
          const Icon = icon ? (Icons as any)[icon] : null;
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
