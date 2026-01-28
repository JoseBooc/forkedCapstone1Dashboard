// src/app/components/views/AnalyticsView.tsx
interface AnalyticsViewProps {
  userRole: 'alumni' | 'admin';
}

export function AnalyticsView({ userRole }: AnalyticsViewProps) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-[#003087]/20">
      <h2 className="text-2xl font-semibold text-[#003087] mb-4">Analytics View</h2>
      <p className="text-muted-foreground">Analytics dashboards and charts will be displayed here. Coming soon!</p>
    </div>
  );
}
