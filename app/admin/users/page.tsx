'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  UserX, 
  UserCheck,
  Mail,
  Calendar,
  Shield,
  Clock
} from 'lucide-react';
import { useUsers } from '@/hooks/useAdmin';
import { User, UserRole } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { Modal } from '@/components/admin/Modal';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const { users, loading, deleteUser, updateUser } = useUsers({ search, role });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {row.original.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium">{row.original.fullName}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Mail size={14} />
          {row.getValue("email")}
        </div>
      )
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={row.original.role === UserRole.ADMIN ? 'danger' : row.original.role === UserRole.ORGANISER ? 'info' : 'primary'}>
          {row.original.role}
        </Badge>
      )
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.original.isActive ? 'bg-success' : 'bg-danger'}`} />
          <span>{row.original.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
              className="p-1.5 hover:bg-primary-muted rounded transition-colors text-text-secondary hover:text-primary"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => updateUser(user.id, { isActive: !user.isActive })}
              className={`p-1.5 hover:bg-primary-muted rounded transition-colors ${user.isActive ? 'text-text-secondary hover:text-danger' : 'text-text-secondary hover:text-success'}`}
              title={user.isActive ? 'Deactivate' : 'Activate'}
            >
              {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary-dark transition-colors text-sm">
          Add New User
        </button>
      </div>

      <div className="bg-surface rounded border border-border-light p-6 shadow-card">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Search Users</label>
            <input 
              type="text" 
              placeholder="Name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border-light rounded text-sm focus:outline-none focus:border-primary-light"
            >
              <option value="">All Roles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.ORGANISER}>Organiser</option>
              <option value={UserRole.CUSTOMER}>Customer</option>
            </select>
          </div>
        </div>

        <DataTable columns={columns} data={users} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-text-secondary hover:bg-border-light rounded transition-colors"
            >
              Close
            </button>
            <button 
              className="px-4 py-2 text-sm font-bold bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Save Changes
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                {selectedUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xl font-bold">{selectedUser.fullName}</h4>
                <p className="text-text-secondary">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant={selectedUser.role === UserRole.ADMIN ? 'danger' : 'primary'}>{selectedUser.role}</Badge>
                  <Badge variant={selectedUser.isActive ? 'success' : 'muted'}>{selectedUser.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase">Account ID</label>
                  <p className="text-sm font-mono mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase">Created Date</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Calendar size={14} className="text-text-muted" />
                    {formatDateTime(selectedUser.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase">Last Login</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock size={14} className="text-text-muted" />
                    {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase">Verification Status</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Shield size={14} className={selectedUser.otpVerified ? "text-success" : "text-warning"} />
                    {selectedUser.otpVerified ? 'OTP Verified' : 'Pending Verification'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase">Quick Actions</label>
                  <div className="flex flex-col gap-2 mt-2">
                    <button className="text-left text-xs font-bold text-primary hover:underline">Reset Password</button>
                    <button className="text-left text-xs font-bold text-primary hover:underline">Resend Verification Email</button>
                    <button className="text-left text-xs font-bold text-danger hover:underline">Force Logout</button>
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
