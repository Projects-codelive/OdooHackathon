import Link from "next/link";

const SERVICE_CARDS = [
  { title: "Health Consultations", desc: "Book verified specialists with flexible timings.", icon: "🩺" },
  { title: "Wellness & Spa", desc: "Reserve relaxing sessions and self-care appointments.", icon: "🧘" },
  { title: "Education & Coaching", desc: "Schedule classes, mentoring, and focused sessions.", icon: "📚" },
  { title: "Business Services", desc: "Consult experts for legal, finance, and strategy needs.", icon: "💼" },
];

export default function ServicesPage() {
  return (
    <div className="section bg-[#FFFBE9] pt-28">
      <div className="page-container">
        <div className="mb-10 text-center">
          <span className="badge mb-4 border border-[#D4B8CF] bg-[#F5EDF4] text-[#724A6A]">Services</span>
          <h1 className="text-4xl font-bold text-[#1A1A2E]">Browse Service Categories</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#4A4A6A]">
            Discover available offerings and continue to booking from your user dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SERVICE_CARDS.map((item) => (
            <div key={item.title} className="card-hover rounded-2xl border border-[#E8E0D0] bg-white p-6">
              <p className="text-3xl">{item.icon}</p>
              <h3 className="mt-3 text-xl font-semibold text-[#1A1A2E]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#8A8AAA]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/user/services" className="btn-primary">Open User Services</Link>
          <Link href="/user/login" className="btn-outline">Login to Book</Link>
        </div>
      </div>
    </div>
  );
}
