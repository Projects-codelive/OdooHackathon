'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  MapPin,
  Calendar,
  MessageSquare,
  History,
  Users
} from 'lucide-react';
import { useBookings } from '@/hooks/useAdmin';
import { Booking, BookingStatus, PaymentStatus } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { Modal } from '@/components/admin/Modal';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';

export default function BookingsPage() {
  const { bookings, loading, updateBookingStatus, refundBooking } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.original.id}</span>
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.customerName}</span>
          <span className="text-[10px] text-text-muted">ID: {row.original.customerId}</span>
        </div>
      )
    },
    {
      accessorKey: "serviceName",
      header: "Service",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.original.serviceName}</span>
          <span className="text-[10px] text-text-muted">Provider: {row.original.providerName}</span>
        </div>
      )
    },
    {
      accessorKey: "dateTime",
      header: "Schedule",
      cell: ({ row }) => formatDateTime(row.original.dateTime)
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge 
            variant={
              status === BookingStatus.CONFIRMED ? 'success' : 
              status === BookingStatus.PENDING ? 'warning' : 
              status === BookingStatus.CANCELLED ? 'danger' : 'info'
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => (
        <Badge variant={row.original.paymentStatus === PaymentStatus.PAID ? 'success' : 'warning'}>
          {row.original.paymentStatus}
        </Badge>
      )
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-bold">{formatCurrency(row.original.amount)}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => { setSelectedBooking(booking); setIsModalOpen(true); }}
              className="p-1.5 hover:bg-primary-muted rounded transition-colors text-text-secondary hover:text-primary"
            >
              <Eye size={16} />
            </button>
            {booking.status === BookingStatus.PENDING && (
              <button 
                onClick={() => updateBookingStatus(booking.id, BookingStatus.CONFIRMED)}
                className="p-1.5 hover:bg-success/10 rounded transition-colors text-success"
                title="Confirm"
              >
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Bookings Management</h1>
        <div className="flex gap-2">
          <button className="bg-surface border border-border-light text-text-secondary px-4 py-2 rounded font-bold hover:bg-primary-muted transition-colors text-sm">
            Export CSV
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary-dark transition-colors text-sm">
            Manual Booking
          </button>
        </div>
      </div>

      <div className="bg-surface rounded border border-border-light shadow-card">
        <DataTable columns={columns} data={bookings} searchKey="customerName" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Booking Detail: ${selectedBooking?.id}`}
        size="lg"
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              {selectedBooking?.paymentStatus === PaymentStatus.PAID && (
                <button 
                  onClick={() => { refundBooking(selectedBooking.id); setIsModalOpen(false); }}
                  className="px-4 py-2 text-sm font-bold text-danger border border-danger/20 hover:bg-danger/5 rounded transition-colors"
                >
                  Issue Refund
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {selectedBooking?.status !== BookingStatus.CANCELLED && (
                <button 
                  onClick={() => { updateBookingStatus(selectedBooking!.id, BookingStatus.CANCELLED); setIsModalOpen(false); }}
                  className="px-4 py-2 text-sm font-bold text-danger hover:bg-danger/5 rounded transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              {selectedBooking?.status === BookingStatus.PENDING && (
                <button 
                  onClick={() => { updateBookingStatus(selectedBooking!.id, BookingStatus.CONFIRMED); setIsModalOpen(false); }}
                  className="px-4 py-2 text-sm font-bold bg-success text-white rounded hover:bg-success/90 transition-colors"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        }
      >
        {selectedBooking && (
          <div className="space-y-8">
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 bg-primary-muted/30 rounded border border-primary/10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  selectedBooking.status === BookingStatus.CONFIRMED ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                )}>
                  {selectedBooking.status === BookingStatus.CONFIRMED ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase">Current Status</p>
                  <p className="text-lg font-bold">{selectedBooking.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-text-secondary uppercase">Created On</p>
                <p className="font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 pb-2 border-b border-border-light">
                  <Users size={16} className="text-primary" /> Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Name</label>
                    <p className="text-sm font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Email</label>
                    <p className="text-sm">customer@example.com</p>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 pb-2 border-b border-border-light">
                  <Calendar size={16} className="text-primary" /> Service Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Service Name</label>
                    <p className="text-sm font-medium text-primary">{selectedBooking.serviceName}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Duration</label>
                      <p className="text-sm">{selectedBooking.duration} minutes</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Provider</label>
                      <p className="text-sm font-medium">{selectedBooking.providerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 pb-2 border-b border-border-light">
                  <CreditCard size={16} className="text-primary" /> Payment Summary
                </h4>
                <div className="p-3 bg-surface border border-border-light rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Amount</span>
                    <span className="font-bold">{formatCurrency(selectedBooking.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Status</span>
                    <Badge variant={selectedBooking.paymentStatus === PaymentStatus.PAID ? 'success' : 'warning'}>
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Custom Answers */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 pb-2 border-b border-border-light">
                  <MessageSquare size={16} className="text-primary" /> Questionnaire
                </h4>
                <div className="space-y-3">
                  {selectedBooking.answers.map((ans) => (
                    <div key={ans.id}>
                      <label className="text-[10px] font-bold text-text-secondary">{ans.questionText}</label>
                      <p className="text-sm italic text-text-primary">"{ans.answer}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 pb-2 border-b border-border-light">
                <History size={16} className="text-primary" /> Internal Notes
              </h4>
              <textarea 
                placeholder="Add private notes for admins..."
                className="w-full p-3 bg-background border border-border-light rounded text-sm min-h-[80px] focus:outline-none focus:border-primary-light"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
