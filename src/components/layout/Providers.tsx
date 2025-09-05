// src/components/layout/Providers.tsx
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Providers OK */}
      <div style={{ background: "#ffc" }}>Providers placeholder</div>
      {children}
    </>
  );
}
