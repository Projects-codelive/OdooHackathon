export default function OrganiserReportsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E8E0D0] bg-white p-5">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Organiser Reports</h1>
        <p className="mt-1 text-sm text-[#8A8AAA]">
          See service performance and booking trends.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E8E0D0] bg-white p-5">
          <p className="text-xs text-[#8A8AAA]">Total Bookings</p>
          <p className="mt-1 text-3xl font-bold text-[#1A1A2E]">0</p>
        </div>
        <div className="rounded-2xl border border-[#E8E0D0] bg-white p-5">
          <p className="text-xs text-[#8A8AAA]">Confirmed</p>
          <p className="mt-1 text-3xl font-bold text-[#1A1A2E]">0</p>
        </div>
        <div className="rounded-2xl border border-[#E8E0D0] bg-white p-5">
          <p className="text-xs text-[#8A8AAA]">Revenue</p>
          <p className="mt-1 text-3xl font-bold text-[#1A1A2E]">0</p>
        </div>
      </div>
    </div>
  );
}
