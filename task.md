# Appointment App: User-Facing Pages Implementation Task List

This document outlines the step-by-step process for implementing the customer-facing booking journey based on the provided specifications.

## Phase 1: Database Schema Updates
- [ ] Add `location`, `imageUrl`, `price`, `cancellationWindowMinutes`, `introMessage`, `confirmationMessage`, and `slotIntervalMinutes` to the `Service` model.
- [ ] Add `headcount` and `rescheduleCount` to the `Booking` model.
- [ ] Create the `RescheduleLog` model and add a `rescheduleLogs` relation to the `Booking` model.
- [ ] Add `phoneNumber` and `avatarUrl` to the `User` model.
- [ ] Create the `ServiceProvider` junction table for mapping `Service` and `User` (providers).
- [ ] Create the `ServiceResource` junction table for mapping `Service` and `Resource`.
- [ ] Run Prisma migration: `npx prisma migrate dev --name add_user_booking_fields`.
- [ ] Run Prisma generate: `npx prisma generate`.

## Phase 2: Design System & Shared Layouts
- [ ] Define the requested design tokens (CSS variables) in `globals.css`.
- [ ] Create a shared layout or middleware for `/user/*` routes that enforces authentication and `CUSTOMER` role access.
- [ ] Build the Top Navbar component (`#714B67` background, logo, search, avatar, logout) to be used across `/user/*` pages.

## Phase 3: API Routes Implementation
- [ ] `GET /api/v1/appointments` - List published services with filtering (free/paid/search).
- [ ] `GET /api/v1/appointments/[id]` - Retrieve details of a specific service/appointment.
- [ ] `GET /api/v1/providers` - List providers assigned to a specific service.
- [ ] `GET /api/v1/resources` - List resources assigned to a specific service.
- [ ] `GET /api/v1/appointments/[id]/slots` - Calculate and return real-time available slots for a given date.
- [ ] `POST /api/v1/bookings` - Create a booking with double-booking prevention (`FOR UPDATE` lock logic).
- [ ] `GET /api/v1/bookings/me` - Fetch current user's past and upcoming bookings.
- [ ] `POST /api/v1/bookings/[id]/cancel` - Cancel a booking, respecting the `cancellationWindowMinutes`.
- [ ] `POST /api/v1/bookings/[id]/reschedule` - Reschedule an existing booking and update the `RescheduleLog`.
- [ ] `GET /api/v1/users/me` - Retrieve current user profile.
- [ ] `PATCH /api/v1/users/me` - Update user profile (Name, Phone).
- [ ] `POST /api/v1/payments/create-intent` - Placeholder for payment initiation.
- [ ] `POST /api/v1/payments/confirm` - Placeholder for payment confirmation logic.

## Phase 4: Frontend Pages Implementation
- [ ] **Page 1: `/user/home`** - Appointments Browse Page.
  - Implement search and filter bar.
  - Implement responsive Appointment Cards grid.
- [ ] **Page 2: `/user/book/[appointmentId]`** - Multi-Step Booking Flow.
  - Step Indicator component.
  - Step 1: Provider/Resource Selection.
  - Step 2: Date Picker & Slot Grid (with `manageCapacity` support).
  - Step 3: Details & Dynamic Questions Form.
  - Step 4: Payment Screen (for paid appointments).
  - Manage state locally with `useState`.
- [ ] **Page 3: `/user/booking/[bookingId]/confirmation`** - Confirmation Screen.
  - Implement Variant A (Instant Confirmation).
  - Implement Variant B (Manual Confirmation - Pending).
- [ ] **Page 4: `/user/booking/[bookingId]/reschedule`** - Reschedule Flow.
  - Reuse Date Picker & Slot Grid.
  - Connect to reschedule API.
- [ ] **Page 5: `/user/profile`** - Profile & My Bookings.
  - Sidebar Navigation.
  - Editable Profile fields.
  - Upcoming & Past Appointments lists.

## Phase 5: Testing & Polish
- [ ] Verify booking conflict scenarios (double booking).
- [ ] Test authorization and routing protections.
- [ ] Verify UI responsiveness across desktop, tablet, and mobile.
