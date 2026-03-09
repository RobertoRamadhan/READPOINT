export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <nav className="bg-blue-950 border-b border-blue-700 px-6 py-4">
        <h1 className="text-white text-2xl font-bold">READPOINT Dashboard</h1>
      </nav>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
