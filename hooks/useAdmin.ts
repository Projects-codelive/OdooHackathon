'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Booking, Payment, DashboardStats,
  ChartDataPoint, ServiceMetric, BookingStatus, PaymentStatus,
} from '../types/admin';

// ─────────────────────────────────────────
// API CLIENT
// ─────────────────────────────────────────

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// ─────────────────────────────────────────
// DASHBOARD HOOK
// ─────────────────────────────────────────

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topServices, setTopServices] = useState<ServiceMetric[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes, bookingsRes] = await Promise.all([
        apiCall<DashboardStats>('/api/admin/stats'),
        apiCall<ChartDataPoint[]>('/api/admin/charts'),
        apiCall<{ data: Booking[] }>('/api/admin/bookings?limit=10'),
      ]);

      setStats(statsRes);
      setChartData(chartsRes);
      setRecentBookings(bookingsRes.data);
      
      // Top services logic (simplified)
      setTopServices([]); 

      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, chartData, topServices, recentBookings, loading, error, refresh: fetchDashboardData };
}

// ─────────────────────────────────────────
// USERS HOOK
// ─────────────────────────────────────────

interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.search) params.append('search', options.search);
      if (options.role) params.append('role', options.role);
      
      const res = await apiCall<{ data: User[], total: number }>(`/api/admin/users?${params.toString()}`);
      setUsers(res.data);
      setTotal(res.total);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.search, options.role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: string) => {
    await apiCall(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    await apiCall(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    loading,
    error,
    deleteUser,
    updateUser,
    refresh: fetchUsers,
  };
}

// ─────────────────────────────────────────
// BOOKINGS HOOK
// ─────────────────────────────────────────

export function useBookings(options: { search?: string, status?: string } = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.search) params.append('search', options.search);
      if (options.status) params.append('status', options.status);

      const res = await apiCall<{ data: Booking[] }>(`/api/admin/bookings?${params.toString()}`);
      setBookings(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    await apiCall(`/api/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    fetchBookings();
  }, [fetchBookings]);

  const refundBooking = useCallback(async (id: string) => {
    await apiCall(`/api/admin/bookings/${id}`, { method: 'POST' });
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    refundBooking,
    refresh: fetchBookings,
  };
}

// ─────────────────────────────────────────
// PAYMENTS HOOK
// ─────────────────────────────────────────

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiCall<{ data: Payment[] }>('/api/admin/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    refresh: fetchPayments,
  };
}
