// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {(() => {
          const Providers = require('@/components/layout/Providers').default;
          const AppShell = require('@/components/layout/AppShell').default;
          return (
            <Providers>
              <AppShell>{children}</AppShell>
            </Providers>
          );
        })()}
      </body>
    </html>
  );
}
