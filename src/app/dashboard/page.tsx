// src/app/dashboard/page.tsx
import PrimaryButton from '@/components/ui/PrimaryButton';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';

export default function Page() {
  return (
    <div>
      Dashboard placeholder
      <div style={{ marginTop: 12 }}>
        <PrimaryButton />
        <StatusChip />
        <EmptyState />
      </div>
    </div>
  );
}
