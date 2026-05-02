'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Bell, 
  ChevronDown,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH = 220;

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Briefcase, label: 'Providers', href: '/admin/providers' },
  { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="h-[48px] bg-surface border-b border-border-light flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-primary-muted rounded transition-colors lg:hidden"
          >
            <Menu size={20} className="text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="font-bold text-primary hidden sm:block">Admin Panel</span>
            <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block" />
            <span className="text-text-secondary text-sm hidden md:block">
              {navItems.find(item => item.href === pathname)?.label || 'Overview'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-primary-muted rounded-full relative transition-colors">
            <Bell size={18} className="text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-primary-muted rounded-full transition-colors border border-transparent hover:border-primary-light/20"
            >
              <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-white text-xs font-medium">
                AD
              </div>
              <span className="text-sm font-medium text-text-primary hidden sm:block">Administrator</span>
              <ChevronDown size={14} className={cn("text-text-secondary transition-transform", isProfileOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-surface rounded shadow-modal border border-border-light py-1 z-50 overflow-hidden"
                  >
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-primary-muted flex items-center gap-2">
                      <UserIcon size={14} /> Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-primary-muted flex items-center gap-2">
                      <Settings size={14} /> My Settings
                    </button>
                    <div className="h-[1px] bg-border-light my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/5 flex items-center gap-2">
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-primary-muted border-r border-border transition-all duration-300 lg:sticky lg:top-[48px] lg:h-[calc(100vh-48px)]",
            isSidebarOpen ? "w-[220px] translate-x-0" : "-translate-x-full lg:w-0"
          )}
        >
          <div className="h-full py-4 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded transition-all group",
                      isActive 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-text-secondary hover:bg-surface hover:text-primary"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "group-hover:text-primary")} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
