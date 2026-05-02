export default function OrganiserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Organiser Dashboard</h1>
        <p className="text-[#8A8AAA]">Manage your services and bookings.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E0D0] shadow-sm">
          <h3 className="text-sm font-medium text-[#8A8AAA]">Active Services</h3>
          <p className="text-3xl font-bold text-[#1A1A2E] mt-1">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8E0D0] shadow-sm">
          <h3 className="text-sm font-medium text-[#8A8AAA]">Today's Bookings</h3>
          <p className="text-3xl font-bold text-[#1A1A2E] mt-1">8</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8E0D0] shadow-sm">
          <h3 className="text-sm font-medium text-[#8A8AAA]">Pending Confirmations</h3>
          <p className="text-3xl font-bold text-[#1A1A2E] mt-1">3</p>
        </div>
      </div>
    </div>
  );
}
