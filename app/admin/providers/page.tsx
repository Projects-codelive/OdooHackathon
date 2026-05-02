'use client';

import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Eye, 
  Star, 
  Briefcase, 
  Calendar, 
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { useUsers } from '@/hooks/useAdmin';
import { User, UserRole } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { Modal } from '@/components/admin/Modal';
import { formatDate, cn } from '@/lib/utils';

export default function ProvidersPage() {
  const { users, loading, updateUser } = useUsers({ role: UserRole.ORGANISER });
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Provider Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-muted text-primary flex items-center justify-center font-bold">
            {row.original.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{row.original.fullName}</span>
            <span className="text-[11px] text-text-secondary">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      header: "Services",
      cell: () => <span className="font-medium">{Math.floor(Math.random() * 5) + 1}</span>
    },
    {
      id: "bookings",
      header: "Total Bookings",
      cell: () => <span className="font-medium">{Math.floor(Math.random() * 200) + 50}</span>
    },
    {
      id: "rating",
      header: "Avg Rating",
      cell: () => (
        <div className="flex items-center gap-1 text-warning">
          <Star size={14} fill="currentColor" />
          <span className="font-bold text-text-primary text-sm">{(4 + Math.random()).toFixed(1)}</span>
        </div>
      )
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'muted'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <button 
            onClick={() => { setSelectedProvider(row.original); setIsModalOpen(true); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-muted rounded transition-colors"
          >
            Manage <ArrowUpRight size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Providers</h1>
          <p className="text-text-secondary text-sm">Manage service providers and their performance.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary-dark transition-colors text-sm flex items-center gap-2">
          Invite Provider
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">Active Providers</p>
          <p className="text-2xl font-bold mt-1">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-surface p-4 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">New This Month</p>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
        <div className="bg-surface p-4 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">Top Performer</p>
          <p className="text-sm font-bold text-primary mt-1">Dr. Sharma Clinics</p>
        </div>
      </div>

      <div className="bg-surface rounded border border-border-light shadow-card">
        <DataTable columns={columns} data={users} searchKey="fullName" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Provider Profile: ${selectedProvider?.fullName}`}
        size="xl"
      >
        {selectedProvider && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 space-y-6">
                <div className="p-6 bg-primary-muted/20 rounded-xl flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                    {selectedProvider.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="text-lg font-bold">{selectedProvider.fullName}</h4>
                  <p className="text-sm text-text-secondary mb-4">{selectedProvider.email}</p>
                  <button 
                    onClick={() => updateUser(selectedProvider.id, { isActive: !selectedProvider.isActive })}
                    className={cn(
                      "w-full py-2 rounded font-bold text-sm transition-colors",
                      selectedProvider.isActive ? "bg-danger/10 text-danger hover:bg-danger/20" : "bg-success/10 text-success hover:bg-success/20"
                    )}
                  >
                    {selectedProvider.isActive ? "Deactivate Provider" : "Activate Provider"}
                  </button>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-xs uppercase text-text-secondary tracking-wider">Performance</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Completion Rate</span>
                      <span className="font-bold">98%</span>
                    </div>
                    <div className="w-full bg-border-light h-1.5 rounded-full overflow-hidden">
                      <div className="bg-success h-full w-[98%]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Response Time</span>
                      <span className="font-bold">~15m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface border border-border-light p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Briefcase size={16} />
                      <span className="text-xs font-bold uppercase">Active Services</span>
                    </div>
                    <p className="text-xl font-bold">4 Services</p>
                  </div>
                  <div className="bg-surface border border-border-light p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Calendar size={16} />
                      <span className="text-xs font-bold uppercase">Bookings (MTD)</span>
                    </div>
                    <p className="text-xl font-bold">42 Bookings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-sm border-b border-border-light pb-2">Offered Services</h5>
                  <div className="space-y-2">
                    {['General Consultation', 'Follow-up Checkup', 'Emergency Visit'].map((svc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border-light rounded hover:border-primary-light transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-medium">{svc}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-text-secondary">$120.00</span>
                          <button className="text-text-muted group-hover:text-primary transition-colors">
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-sm border-b border-border-light pb-2">Recent Reviews</h5>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-muted/10 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold">Anita P.</span>
                        <div className="flex text-warning">
                          {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary italic">"Excellent service, very professional and punctual."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
