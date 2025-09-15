// src/app/dashboard/page.tsx
import PrimaryButton from '@/components/ui/PrimaryButton';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import Button from "@/components/ui/PrimaryButton";

export default function Page() {
  return (
    <div>
      Dashboard placeholder
      <div style={{ marginTop: 12 }}>
<div className="space-x-4">
      <Button>Default</Button>
      <Button>Hover Me</Button>
      <Button>Click Action</Button>
      <Button disabled>Disabled</Button>
    </div>
        <EmptyState />
      </div>
    </div>
  );
}
