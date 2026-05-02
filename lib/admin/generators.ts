// lib/admin/generators.ts

import {
  User, Service, Booking, Payment, DashboardStats,
  ChartDataPoint, ServiceMetric, AuditLog, UserRole, BookingStatus,
  PaymentStatus, AppointmentType,
} from '../../types/admin';

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

export function generateDummyUsers(count: number = 50): User[] {
  const firstNames = ['Abhishek', 'Priya', 'Rajesh', 'Ananya', 'Vikram', 'Neha', 'Arun', 'Divya'];
  const lastNames = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Verma', 'Gupta', 'Chopra', 'Bhat'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'];

  const roles: UserRole[] = [UserRole.CUSTOMER, UserRole.CUSTOMER, UserRole.CUSTOMER, UserRole.ORGANISER, UserRole.ADMIN];

  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    users.push({
      id: `usr_${String(i).padStart(4, '0')}`,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`,
      role,
      isActive: Math.random() > 0.1, // 90% active
      otpVerified: Math.random() > 0.05, // 95% verified
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
      lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
    });
  }

  return users;
}

// ─────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────

export function generateDummyServices(count: number = 20): Service[] {
  const serviceNames = [
    'Dental Care',
    'Hair Salon',
    'Yoga Class',
    'Fitness Coaching',
    'Career Consultation',
    'Photography Session',
    'Web Design',
    'Medical Checkup',
    'Therapy Session',
    'Guitar Lessons',
    'Language Tutoring',
    'Car Service',
  ];

  const services: Service[] = [];
  const users = generateDummyUsers(10);
  const organisers = users.filter(u => u.role === UserRole.ORGANISER || u.role === UserRole.ADMIN);

  for (let i = 0; i < Math.min(count, serviceNames.length); i++) {
    const organiser = organisers[i % organisers.length];

    services.push({
      id: `svc_${String(i + 1).padStart(4, '0')}`,
      organiserId: organiser.id,
      title: serviceNames[i],
      description: `Professional ${serviceNames[i]} service with expert professionals`,
      duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
      type: Math.random() > 0.5 ? AppointmentType.USER_BASED : AppointmentType.RESOURCE_BASED,
      isPublished: Math.random() > 0.2, // 80% published
      advancePayment: Math.random() > 0.5,
      paymentAmount: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 500 : undefined,
      manualConfirm: Math.random() > 0.7,
      maxPerSlot: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  return services;
}

// ─────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────

export function generateDummyBookings(count: number = 100): Booking[] {
  const users = generateDummyUsers(50);
  const services = generateDummyServices(20);

  const customers = users.filter(u => u.role === UserRole.CUSTOMER);
  const providers = users.filter(u => [UserRole.ORGANISER, UserRole.ADMIN].includes(u.role));

  const statuses: BookingStatus[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
  ];

  const bookings: Booking[] = [];

  for (let i = 1; i <= count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const bookingDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    const paymentStatus = status === BookingStatus.COMPLETED ? PaymentStatus.PAID
      : status === BookingStatus.CANCELLED ? PaymentStatus.UNPAID
      : Math.random() > 0.5 ? PaymentStatus.PAID : PaymentStatus.UNPAID;

    bookings.push({
      id: `bk_${String(i).padStart(6, '0')}`,
      customerId: customer.id,
      customerName: customer.fullName,
      serviceId: service.id,
      serviceName: service.title,
      providerId: provider.id,
      providerName: provider.fullName,
      status,
      paymentStatus,
      amount: service.paymentAmount ?? Math.floor(Math.random() * 3000) + 500,
      currency: 'USD',
      dateTime: bookingDate,
      duration: service.duration,
      answers: [
        {
          id: `ans_1`,
          bookingId: `bk_${String(i).padStart(6, '0')}`,
          questionId: 'q_1',
          questionText: 'Please describe your issue',
          answer: 'Sample response from customer',
        },
      ],
      notes: Math.random() > 0.8 ? 'Important: Please bring ID proof' : undefined,
      confirmedAt: status !== BookingStatus.PENDING ? bookingDate : undefined,
      cancelledAt: status === BookingStatus.CANCELLED ? new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
      createdAt: bookingDate,
      updatedAt: new Date(bookingDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  return bookings;
}

// ─────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────

export function generateDummyPayments(bookings: Booking[]): Payment[] {
  return bookings
    .filter(b => b.paymentStatus !== PaymentStatus.UNPAID)
    .map((booking, index) => ({
      id: `pay_${String(index + 1).padStart(6, '0')}`,
      bookingId: booking.id,
      amount: booking.amount,
      currency: booking.currency,
      status: booking.paymentStatus,
      gatewayProvider: ['stripe', 'razorpay'][Math.floor(Math.random() * 2)],
      gatewayRef: `txn_${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      idempotencyKey: `idempotent_${booking.id}`,
      paidAt: booking.paymentStatus !== PaymentStatus.UNPAID ? new Date(booking.createdAt) : undefined,
      refundedAt: booking.paymentStatus === PaymentStatus.REFUNDED ? new Date(booking.createdAt.getTime() + 48 * 60 * 60 * 1000) : undefined,
      failureReason: undefined,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));
}

// ─────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────

export function generateDummyDashboardStats(users: User[], bookings: Booking[]): DashboardStats {
  const totalUsers = users.length;
  const totalOrganisers = users.filter(u => u.role === UserRole.ORGANISER).length;
  const totalCustomers = users.filter(u => u.role === UserRole.CUSTOMER).length;
  const totalAdmins = users.filter(u => u.role === UserRole.ADMIN).length;

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);

  const thisMonthBookings = bookings.filter(b => b.createdAt >= thisMonthStart);
  const completedBookings = thisMonthBookings.filter(b => b.status === BookingStatus.COMPLETED);
  const cancelledBookings = thisMonthBookings.filter(b => b.status === BookingStatus.CANCELLED);

  const revenueThisMonth = thisMonthBookings
    .filter(b => b.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, b) => sum + b.amount, 0);

  const yearStart = new Date();
  yearStart.setMonth(0);
  yearStart.setDate(1);

  const revenueYearToDate = bookings
    .filter(b => b.createdAt >= yearStart && b.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, b) => sum + b.amount, 0);

  const paidBookings = bookings.filter(b => b.paymentStatus === PaymentStatus.PAID);
  const averageOrderValue = paidBookings.length > 0
    ? paidBookings.reduce((sum, b) => sum + b.amount, 0) / paidBookings.length
    : 0;

  return {
    totalUsers,
    totalOrganisers,
    totalCustomers,
    totalAdmins,
    activeProviders: totalOrganisers + totalAdmins,
    bookingsThisMonth: thisMonthBookings.length,
    bookingsCompleted: completedBookings.length,
    bookingsCancelled: cancelledBookings.length,
    revenueThisMonth,
    revenueYearToDate,
    averageOrderValue,
    userGrowthPercent: 12.5,
    bookingGrowthPercent: 8.3,
    revenueGrowthPercent: 15.7,
  };
}

// ─────────────────────────────────────────
// CHART DATA
// ─────────────────────────────────────────

export function generateChartData(bookings: Booking[]): ChartDataPoint[] {
  const data: { [key: string]: ChartDataPoint } = {};

  // Last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    data[dateStr] = {
      date: dateStr,
      bookings: 0,
      revenue: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  bookings.forEach(booking => {
    const dateStr = booking.createdAt.toISOString().split('T')[0];

    if (data[dateStr]) {
      data[dateStr].bookings++;
      if (booking.paymentStatus === PaymentStatus.PAID) {
        data[dateStr].revenue += booking.amount;
      }
      if (booking.status === BookingStatus.COMPLETED) {
        data[dateStr].completed++;
      } else if (booking.status === BookingStatus.CANCELLED) {
        data[dateStr].cancelled++;
      }
    }
  });

  return Object.values(data);
}

// ─────────────────────────────────────────
// SERVICE METRICS
// ─────────────────────────────────────────

export function generateServiceMetrics(bookings: Booking[], services: Service[]): ServiceMetric[] {
  return services.map(service => {
    const serviceBookings = bookings.filter(b => b.serviceId === service.id);
    const completed = serviceBookings.filter(b => b.status === BookingStatus.COMPLETED);
    const cancelled = serviceBookings.filter(b => b.status === BookingStatus.CANCELLED);

    return {
      serviceId: service.id,
      serviceName: service.title,
      bookingsCount: serviceBookings.length,
      revenue: serviceBookings
        .filter(b => b.paymentStatus === PaymentStatus.PAID)
        .reduce((sum, b) => sum + b.amount, 0),
      completionRate: serviceBookings.length > 0 ? (completed.length / serviceBookings.length) * 100 : 0,
      cancellationRate: serviceBookings.length > 0 ? (cancelled.length / serviceBookings.length) * 100 : 0,
    };
  }).sort((a, b) => b.bookingsCount - a.bookingsCount);
}

// ─────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────

export function generateDummyAuditLogs(count: number = 50): AuditLog[] {
  const actions = [
    'USER_CREATED',
    'USER_UPDATED',
    'USER_DEACTIVATED',
    'BOOKING_CONFIRMED',
    'BOOKING_CANCELLED',
    'PAYMENT_REFUNDED',
    'SERVICE_PUBLISHED',
    'SERVICE_UNPUBLISHED',
  ];

  const logs: AuditLog[] = [];
  const users = generateDummyUsers(10);
  const admins = users.filter(u => u.role === UserRole.ADMIN);

  for (let i = 1; i <= count; i++) {
    const admin = admins[Math.floor(Math.random() * admins.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    logs.push({
      id: `aud_${String(i).padStart(6, '0')}`,
      actorId: admin.id,
      actorName: admin.fullName,
      action,
      targetId: `${action.split('_')[0].toLowerCase()}_${Math.floor(Math.random() * 1000)}`,
      targetType: action.split('_')[0],
      metadata: { field: 'value', previous: 'old', new: 'new' },
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }

  return logs.reverse();
}
