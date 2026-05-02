import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="section bg-[#FFFBE9] pt-28">
      <div className="page-container max-w-3xl text-center">
        <span className="badge mb-4 border border-[#FFE88A] bg-[#FFF3C4] text-[#D4A017]">About Bookora</span>
        <h1 className="text-4xl font-bold text-[#1A1A2E]">Modern Booking, Built for Teams</h1>
        <p className="mt-4 leading-relaxed text-[#4A4A6A]">
          Bookora helps customers, organisers, and admins manage appointment workflows in one unified system.
          The platform is designed around real-time slot control, role-based access, and an elegant user experience.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E0D0] bg-white p-4">
            <p className="text-2xl">⚡</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1A2E]">Fast Booking Flow</p>
          </div>
          <div className="rounded-2xl border border-[#E8E0D0] bg-white p-4">
            <p className="text-2xl">🛡️</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1A2E]">Secure by Design</p>
          </div>
          <div className="rounded-2xl border border-[#E8E0D0] bg-white p-4">
            <p className="text-2xl">📊</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1A2E]">Multi-role Platform</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/register" className="btn-primary">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
