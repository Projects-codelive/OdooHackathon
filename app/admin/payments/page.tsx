'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  CreditCard, 
  Download, 
  Filter, 
  ExternalLink,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { usePayments } from '@/hooks/useAdmin';
import { Payment, PaymentStatus } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { Modal } from '@/components/admin/Modal';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function PaymentsPage() {
  const { payments, loading } = usePayments();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold">{row.original.id}</span>
          <ExternalLink size={12} className="text-text-muted hover:text-primary cursor-pointer" />
        </div>
      )
    },
    {
      accessorKey: "bookingId",
      header: "Booking Ref",
      cell: ({ row }) => <span className="text-xs font-medium text-text-secondary">{row.original.bookingId}</span>
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-bold text-foreground">
          {formatCurrency(row.original.amount, row.original.currency)}
        </span>
      )
    },
    {
      accessorKey: "gatewayProvider",
      header: "Gateway",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary-muted rounded flex items-center justify-center">
            <CreditCard size={10} className="text-primary" />
          </div>
          <span className="capitalize text-xs font-medium">{row.original.gatewayProvider}</span>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === PaymentStatus.PAID ? 'success' : row.original.status === PaymentStatus.REFUNDED ? 'info' : 'warning'}>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: "paidAt",
      header: "Date",
      cell: ({ row }) => row.original.paidAt ? formatDateTime(row.original.paidAt) : formatDateTime(row.original.createdAt)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button 
            onClick={() => { setSelectedPayment(row.original); setIsModalOpen(true); }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-text-secondary text-sm">Track transactions, refunds, and payout status.</p>
        </div>
        <button className="bg-surface border border-border-light text-text-secondary px-4 py-2 rounded font-bold hover:bg-primary-muted transition-colors text-sm flex items-center gap-2">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded border border-border-light shadow-card relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-text-secondary uppercase">Gross Volume</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(124500)}</p>
            <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-2">
              <ArrowUpRight size={12} /> +12% from last month
            </div>
          </div>
          <CreditCard size={60} className="absolute -bottom-4 -right-4 opacity-5 text-primary" />
        </div>
        <div className="bg-surface p-5 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">Net Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(98200)}</p>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-2">
            <ArrowUpRight size={12} /> +8% from last month
          </div>
        </div>
        <div className="bg-surface p-5 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">Pending Payouts</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(12450)}</p>
          <div className="flex items-center gap-1 text-warning text-[10px] font-bold mt-2">
            Next payout in 2 days
          </div>
        </div>
        <div className="bg-surface p-5 rounded border border-border-light shadow-card">
          <p className="text-xs font-bold text-text-secondary uppercase">Refund Rate</p>
          <p className="text-2xl font-bold mt-1">1.2%</p>
          <div className="flex items-center gap-1 text-danger text-[10px] font-bold mt-2">
            <ArrowDownLeft size={12} /> -0.4% from last month
          </div>
        </div>
      </div>

      <div className="bg-surface rounded border border-border-light shadow-card">
        <DataTable columns={columns} data={payments} searchKey="id" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Transaction Details"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-bold text-text-secondary hover:bg-border-light rounded transition-colors">
              Print Receipt
            </button>
            {selectedPayment?.status === PaymentStatus.PAID && (
              <button className="px-4 py-2 text-sm font-bold bg-danger text-white rounded hover:bg-danger/90 transition-colors">
                Refund Transaction
              </button>
            )}
          </div>
        }
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="text-center py-4 bg-primary-muted/10 rounded-lg border border-primary/5">
              <p className="text-xs font-bold text-text-secondary uppercase">Amount Paid</p>
              <h4 className="text-3xl font-bold text-primary">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</h4>
              <div className="mt-2">
                <Badge variant={selectedPayment.status === PaymentStatus.PAID ? 'success' : 'warning'}>
                  {selectedPayment.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-sm border-b border-border-light pb-2">Payment Details</h5>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase block">Transaction Date</label>
                  <span>{selectedPayment.paidAt ? formatDateTime(selectedPayment.paidAt) : formatDateTime(selectedPayment.createdAt)}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase block">Gateway Provider</label>
                  <span className="capitalize">{selectedPayment.gatewayProvider}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase block">Gateway Ref</label>
                  <span className="font-mono text-xs">{selectedPayment.gatewayRef || 'N/A'}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase block">Idempotency Key</label>
                  <span className="font-mono text-[10px] truncate block max-w-[120px]">{selectedPayment.idempotencyKey}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-success/5 rounded border border-success/10 flex gap-3">
              <ShieldCheck className="text-success shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-success uppercase">Security Status</p>
                <p className="text-xs text-text-secondary mt-0.5">Verified transaction. No fraud flags detected for this payment source.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Associated Booking</label>
              <div className="flex items-center justify-between p-3 bg-surface border border-border-light rounded hover:border-primary-light transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-muted text-primary flex items-center justify-center">
                    <ArrowDownLeft size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedPayment.bookingId}</p>
                    <p className="text-[11px] text-text-secondary">View original booking</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
