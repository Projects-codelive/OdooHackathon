// types/admin.ts

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ORGANISER = 'ORGANISER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING',
}

export enum AppointmentType {
  USER_BASED = 'USER_BASED',
  RESOURCE_BASED = 'RESOURCE_BASED',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  otpVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Service {
  id: string;
  organiserId: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  type: AppointmentType;
  isPublished: boolean;
  advancePayment: boolean;
  paymentAmount?: number;
  manualConfirm: boolean;
  maxPerSlot: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  providerId?: string;
  providerName?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  dateTime: Date;
  duration: number;
  answers: BookingAnswer[];
  notes?: string;
  confirmedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingAnswer {
  id: string;
  bookingId: string;
  questionId: string;
  questionText: string;
  answer: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayProvider?: string;
  gatewayRef?: string;
  idempotencyKey: string;
  paidAt?: Date;
  refundedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrganisers: number;
  totalCustomers: number;
  totalAdmins: number;
  activeProviders: number;
  bookingsThisMonth: number;
  bookingsCompleted: number;
  bookingsCancelled: number;
  revenueThisMonth: number;
  revenueYearToDate: number;
  averageOrderValue: number;
  userGrowthPercent: number;
  bookingGrowthPercent: number;
  revenueGrowthPercent: number;
}

export interface ChartDataPoint {
  date: string;
  bookings: number;
  revenue: number;
  completed: number;
  cancelled: number;
}

export interface ServiceMetric {
  serviceId: string;
  serviceName: string;
  bookingsCount: number;
  revenue: number;
  completionRate: number;
  cancellationRate: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetId?: string;
  targetType?: string; // 'USER', 'BOOKING', 'PAYMENT', etc.
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface PlatformSetting {
  key: string;
  value: string | number | boolean;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  options?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
