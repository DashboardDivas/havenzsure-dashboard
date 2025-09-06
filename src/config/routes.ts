export type NavItem = {
  label: string;
  path: string;
  icon?: 'Dashboard'|'Assignment'|'Build'|'History'|'People'|'Store'|'Settings'|'Help';
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',   path: '/dashboard',   icon: 'Dashboard' },
  { label: 'Work Orders', path: '/work-orders', icon: 'Assignment' },
  { label: 'Jobs',        path: '/jobs',        icon: 'Build' },
  { label: 'History',     path: '/history',     icon: 'History' },
  { label: 'User',        path: '/user',        icon: 'People' },  // RBAC: ADMIN ONLY
  { label: 'Shop',        path: '/shop',        icon: 'Store' },   // RBAC: ADMIN ONLY
  { label: 'Settings',    path: '/settings',    icon: 'Settings' },
  { label: 'Help',        path: '/help',        icon: 'Help' },
];
