'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import LoginForm from "@/components/auth/LoginForm";
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to access the command center.</p>
        </div>

        <div className="auth-form-container">
          <LoginForm roleDisplay="Admin" />
        </div>

        <div className="text-center">
          <Link 
            href="/"
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Back to Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
