"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, DollarSign } from "lucide-react";

type Service = any;

interface BookingWizardProps {
  service: Service;
  user: any;
}

export default function BookingWizard({ service, user }: BookingWizardProps) {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [headcount, setHeadcount] = useState(1);
  const [notes, setNotes] = useState("");

  // Mock available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  // Mock available times
  const availableTimes = ["09:00", "10:00", "11:30", "14:00", "15:30", "16:00"];

  const handleNext = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      setError("Please select both a date and time.");
      return;
    }
    if (step === 2 && headcount < 1) {
      setError("Headcount must be at least 1.");
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleBook = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app we would resolve a ProviderSlot here.
      // For this wizard, we'll pass the requested time to our API to create the booking.
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date: selectedDate,
          time: selectedTime,
          headcount,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      setStep(4); // Success step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[500px]">
      {/* Sidebar / Progress */}
      <div className="w-full md:w-1/3 bg-[#714B67] p-6 text-white flex flex-col">
        <h2 className="text-xl font-bold mb-2">{service.title}</h2>
        <div className="flex items-center gap-2 text-white/80 text-sm mb-8">
          <Clock size={14} /> {service.durationMinutes} min
          {service.price && <><span className="mx-1">•</span> <DollarSign size={14} /> ${service.price}</>}
        </div>

        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/20 z-0 hidden md:block"></div>
          
          {[
            { num: 1, title: "Date & Time" },
            { num: 2, title: "Details" },
            { num: 3, title: "Payment" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-4 z-10">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > s.num
                    ? "bg-green-400 text-[#714B67]"
                    : step === s.num
                    ? "bg-white text-[#714B67] ring-4 ring-white/30"
                    : "bg-white/20 text-white"
                }`}
              >
                {step > s.num ? <CheckCircle2 size={14} /> : s.num}
              </div>
              <span className={`font-medium ${step === s.num ? "text-white" : "text-white/60"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date & Time</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Dates</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map((date) => {
                  const d = new Date(date);
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl border transition ${
                        selectedDate === date
                          ? "border-[#714B67] bg-[#714B67]/5 text-[#714B67] ring-1 ring-[#714B67]"
                          : "border-gray-200 hover:border-[#714B67]/50 text-gray-600"
                      }`}
                    >
                      <span className="text-xs uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-lg font-bold">{d.getDate()}</span>
                      <span className="text-xs">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg border text-sm font-medium transition ${
                        selectedTime === time
                          ? "border-[#714B67] bg-[#714B67] text-white"
                          : "border-gray-200 hover:border-[#714B67] text-gray-700"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of People <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={service.maxPerSlot || 10}
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value) || 1)}
                    className="pl-10 w-full border border-gray-300 rounded-xl py-2 focus:ring-[#714B67] focus:border-[#714B67] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information?"
                    className="pl-10 w-full border border-gray-300 rounded-xl py-2 focus:ring-[#714B67] focus:border-[#714B67] outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Payment */}
        {step === 3 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review & Payment</h3>
            
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Headcount</span>
                  <span className="font-medium text-gray-900">{headcount} {headcount === 1 ? 'Person' : 'People'}</span>
                </div>
                {service.price && (
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#714B67]">${(service.price * headcount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={isSubmitting}
              className="w-full bg-[#714B67] hover:bg-[#5a3c52] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={18} />
                  {service.price ? `Pay $${(service.price * headcount).toFixed(2)} & Book` : "Confirm Booking"}
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Secure mocked payment
            </p>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Your appointment for <span className="font-semibold text-gray-900">{service.title}</span> has been successfully scheduled for <span className="font-semibold text-gray-900">{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</span>.
            </p>
            <button
              onClick={() => router.push("/user/home")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-6 rounded-xl transition"
            >
              Return Home
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className={`flex items-center gap-1 font-medium py-2 px-4 rounded-xl transition ${
                step === 1 || isSubmitting
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} /> Back
            </button>
            
            {step < 3 && (
              <button
                onClick={handleNext}
                className="bg-[#714B67] hover:bg-[#5a3c52] text-white font-medium py-2 px-6 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                Next Step <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
