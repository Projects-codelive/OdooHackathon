"use client";

import BookingWizard from "./BookingWizard";

interface BookingClientProps {
  service: any;
  user: any;
}

export default function BookingClient({ service, user }: BookingClientProps) {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8 px-2">
        <h1 className="text-3xl font-bold text-[#1A1A2E]">Book Appointment</h1>
        <p className="text-[#4A4A6A] mt-2 font-medium">Complete the steps below to secure your booking.</p>
      </div>

      <BookingWizard service={service} user={user} />
    </div>
  );
}
