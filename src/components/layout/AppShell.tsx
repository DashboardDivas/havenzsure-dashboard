export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ background: "#eee", padding: "8px" }}>
        🧱 AppShell placeholder
      </header>
      <main>{children}</main>
    </div>
  );
}
