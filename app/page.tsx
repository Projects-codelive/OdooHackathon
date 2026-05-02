import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 font-sans text-white px-4">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center py-20">
        
        {/* Animated glowing orb behind the content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Authentication Portal
          </h1>
          
          <p className="max-w-xl text-lg leading-relaxed text-gray-300">
            Welcome to the secure authentication system. Experience seamless login, registration, and role management built with premium design and top-tier security.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl mt-6 justify-center">
            <Link
              href="/user/login"
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02]"
            >
              👤 User Login
            </Link>
            
            <Link
              href="/organizer/login"
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02]"
            >
              🏢 Organizer Login
            </Link>

            <Link
              href="/admin/login"
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-[1.02]"
            >
              ⚡ Admin Login
            </Link>
          </div>

          <div className="mt-4">
            <Link
              href="/register"
              className="flex items-center justify-center h-12 rounded-xl border border-white/20 bg-white/5 px-8 font-medium text-white transition-all hover:bg-white/10 hover:border-white/30 hover:scale-[1.02]"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
