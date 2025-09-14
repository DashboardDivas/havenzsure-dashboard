// src/app/dashboard/page.tsx
import PrimaryButton from '@/components/ui/PrimaryButton';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import UserList from '@/components/ui/UserList';

export default function Page() {
  return (
    <div>
      Dashboard placeholder
      <div style={{ marginTop: 12 }}>
        <PrimaryButton />
        <EmptyState />
      </div>
    </div>
  );
}
