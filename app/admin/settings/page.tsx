'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Bell, 
  Users,
  Save,
  RefreshCw,
  Clock,
  History
} from 'lucide-react';
import { Badge } from '@/components/admin/Badge';
import { formatDateTime } from '@/lib/utils';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('platform');

  const sections = [
    { id: 'platform', label: 'Platform Config', icon: Globe },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'admins', label: 'Admin Access', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: History },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-text-secondary text-sm">Configure platform defaults and manage administrative access.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-dark transition-colors text-sm flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                activeSection === section.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:bg-primary-muted hover:text-primary'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface rounded border border-border-light shadow-card p-8">
          {activeSection === 'platform' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-border-light pb-4">
                <h3 className="text-lg font-bold">General Configuration</h3>
                <p className="text-text-secondary text-sm">Basic platform settings used across the application.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Platform Name</label>
                  <input 
                    type="text" 
                    defaultValue="Odoo Appointments"
                    className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Default Currency</label>
                  <select className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light">
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Default Timezone</label>
                  <select className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>IST (Indian Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Max Booking Advance (Days)</label>
                  <input 
                    type="number" 
                    defaultValue={90}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Maintenance Mode</p>
                    <p className="text-xs text-text-secondary">Disable customer booking during system updates.</p>
                  </div>
                  <div className="w-12 h-6 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-border-light pb-4">
                <div>
                  <h3 className="text-lg font-bold">System Audit Logs</h3>
                  <p className="text-text-secondary text-sm">Traceable record of all administrative actions.</p>
                </div>
                <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                  <RefreshCw size={14} /> Refresh Logs
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { actor: 'Administrator', action: 'USER_DEACTIVATED', target: 'usr_1024', time: new Date() },
                  { actor: 'Administrator', action: 'PAYMENT_REFUNDED', target: 'pay_9921', time: new Date(Date.now() - 3600000) },
                  { actor: 'System', action: 'DB_BACKUP_SUCCESS', target: 'backup_v42', time: new Date(Date.now() - 7200000) },
                  { actor: 'Administrator', action: 'SETTING_CHANGED', target: 'platform_name', time: new Date(Date.now() - 86400000) },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-background border border-border-light rounded-lg hover:border-primary-light transition-colors">
                    <div className="p-2 bg-primary-muted rounded">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{log.actor}</span>
                        <span className="text-xs text-text-secondary">performed</span>
                        <Badge variant="muted">{log.action}</Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-1">Target ID: {log.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted font-bold uppercase">{formatDateTime(log.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
