'use client';

import React from 'react';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  DollarSign, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useDashboard } from '@/hooks/useAdmin';
import { StatsCard } from '@/components/admin/StatsCard';
import { Badge } from '@/components/admin/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { stats, chartData, topServices, recentBookings, loading } = useDashboard();

  if (loading || !stats) {
    return <div className="flex items-center justify-center h-[60vh]">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="text-xs text-text-secondary bg-surface border border-border-light px-3 py-1.5 rounded flex items-center gap-2">
          <Clock size={14} /> Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          trend={stats.userGrowthPercent}
          color="primary"
        />
        <StatsCard 
          title="Active Providers" 
          value={stats.activeProviders.toLocaleString()} 
          icon={UserCheck} 
          trend={2.4}
          color="success"
        />
        <StatsCard 
          title="Monthly Bookings" 
          value={stats.bookingsThisMonth.toLocaleString()} 
          icon={CalendarCheck} 
          trend={stats.bookingGrowthPercent}
          color="info"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats.revenueThisMonth)} 
          icon={DollarSign} 
          trend={stats.revenueGrowthPercent}
          color="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded border border-border-light p-6 shadow-card">
          <h3 className="text-lg font-bold mb-6">Revenue Trend (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6C757D' }}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6C757D' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #DEE2E6', borderRadius: '4px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#714B67" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded border border-border-light p-6 shadow-card">
          <h3 className="text-lg font-bold mb-6">Top Services by Bookings</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="serviceName" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#212529', fontWeight: 500 }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#F3EEF2' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #DEE2E6', borderRadius: '4px', fontSize: '12px' }}
                />
                <Bar dataKey="bookingsCount" radius={[0, 4, 4, 0]}>
                  {topServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#714B67' : '#875A7B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-surface rounded border border-border-light shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
            <h3 className="font-bold">Recent Bookings</h3>
            <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              View All <ExternalLink size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary-muted/20 text-xs font-bold text-text-secondary uppercase">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-primary-muted/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{booking.customerName}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{booking.serviceName}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDateTime(booking.dateTime)}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          booking.status === 'CONFIRMED' ? 'success' : 
                          booking.status === 'PENDING' ? 'warning' : 
                          booking.status === 'CANCELLED' ? 'danger' : 'info'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">{formatCurrency(booking.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Alerts */}
        <div className="space-y-4">
          <h3 className="font-bold">System Health</h3>
          <div className="bg-surface rounded border border-border-light p-4 shadow-card space-y-4">
            <div className="flex gap-3">
              <div className="p-2 bg-warning/10 text-warning rounded-lg h-fit">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">High Cancellation Rate</p>
                <p className="text-xs text-text-secondary mt-1">Cancellation rate is 15% higher than previous week.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 bg-danger/10 text-danger rounded-lg h-fit">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Payment Failures</p>
                <p className="text-xs text-text-secondary mt-1">12 payments failed in the last 24 hours.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 bg-info/10 text-info rounded-lg h-fit">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Maintenance Scheduled</p>
                <p className="text-xs text-text-secondary mt-1">System update scheduled for Sunday, 2:00 AM UTC.</p>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-lg p-5 shadow-card relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Total Revenue YTD</p>
              <h4 className="text-3xl font-bold">{formatCurrency(stats.revenueYearToDate)}</h4>
              <p className="text-xs mt-3 bg-white/20 w-fit px-2 py-0.5 rounded backdrop-blur-sm">
                Next Payout: May 15
              </p>
            </div>
            <DollarSign size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
