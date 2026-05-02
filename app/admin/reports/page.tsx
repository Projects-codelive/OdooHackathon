'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useDashboard } from '@/hooks/useAdmin';
import { Badge } from '@/components/admin/Badge';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#714B67', '#875A7B', '#28A745', '#E2A03F', '#DC3545', '#17A2B8'];

export default function ReportsPage() {
  const { stats, chartData, topServices, loading } = useDashboard();
  const [activeTab, setActiveTab] = useState('revenue');

  if (loading || !stats) return <div className="p-8 text-center">Loading reports...</div>;

  const bookingStatusData = [
    { name: 'Completed', value: stats.bookingsCompleted },
    { name: 'Cancelled', value: stats.bookingsCancelled },
    { name: 'Pending', value: stats.bookingsThisMonth - stats.bookingsCompleted - stats.bookingsCancelled },
  ];

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'services', label: 'Services', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: PieChartIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-text-secondary text-sm">In-depth analysis of platform performance.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-surface border border-border-light px-3 py-1.5 rounded text-sm text-text-secondary">
            <Calendar size={16} /> Last 30 Days
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary-dark transition-colors text-sm flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-light overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-text-secondary hover:text-primary hover:bg-primary-muted/50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded border border-border-light shadow-card">
              <p className="text-xs font-bold text-text-secondary uppercase">Gross Revenue</p>
              <h4 className="text-3xl font-bold mt-2">{formatCurrency(stats.revenueThisMonth)}</h4>
              <div className="flex items-center gap-1 text-success text-xs font-bold mt-4">
                <ArrowUpRight size={14} /> +15.7% <span className="text-text-muted font-normal ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-surface p-6 rounded border border-border-light shadow-card">
              <p className="text-xs font-bold text-text-secondary uppercase">Average Order Value</p>
              <h4 className="text-3xl font-bold mt-2">{formatCurrency(stats.averageOrderValue)}</h4>
              <div className="flex items-center gap-1 text-success text-xs font-bold mt-4">
                <ArrowUpRight size={14} /> +4.2% <span className="text-text-muted font-normal ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-surface p-6 rounded border border-border-light shadow-card">
              <p className="text-xs font-bold text-text-secondary uppercase">Total Refunded</p>
              <h4 className="text-3xl font-bold mt-2">{formatCurrency(1240)}</h4>
              <div className="flex items-center gap-1 text-danger text-xs font-bold mt-4">
                <ArrowDownRight size={14} /> -2.1% <span className="text-text-muted font-normal ml-1">vs last month</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded border border-border-light p-6 shadow-card">
            <h3 className="text-lg font-bold mb-6">Revenue Growth</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6C757D' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #DEE2E6', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#714B67" 
                    strokeWidth={3} 
                    dot={{ fill: '#714B67', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Daily Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded border border-border-light p-6 shadow-card">
            <h3 className="text-lg font-bold mb-6">Booking Status Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface rounded border border-border-light p-6 shadow-card">
            <h3 className="text-lg font-bold mb-6">Daily Bookings Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6C757D' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} />
                  <Tooltip 
                    cursor={{ fill: '#F3EEF2' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #DEE2E6', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Bar dataKey="bookings" fill="#875A7B" radius={[4, 4, 0, 0]} name="Total Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-surface rounded border border-border-light shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light">
            <h3 className="font-bold">Service Performance Matrix</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary-muted/20 text-xs font-bold text-text-secondary uppercase">
                <th className="px-6 py-3">Service Name</th>
                <th className="px-6 py-3">Total Bookings</th>
                <th className="px-6 py-3">Revenue Generated</th>
                <th className="px-6 py-3">Completion Rate</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {topServices.map((svc) => (
                <tr key={svc.serviceId} className="hover:bg-primary-muted/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{svc.serviceName}</td>
                  <td className="px-6 py-4 text-sm">{svc.bookingsCount}</td>
                  <td className="px-6 py-4 text-sm font-medium">{formatCurrency(svc.revenue)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-border-light h-1.5 rounded-full overflow-hidden">
                        <div className="bg-success h-full" style={{ width: `${svc.completionRate}%` }} />
                      </div>
                      <span className="text-xs font-bold">{svc.completionRate.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={svc.completionRate > 90 ? 'success' : 'warning'}>
                      {svc.completionRate > 90 ? 'Top Performer' : 'Stable'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
