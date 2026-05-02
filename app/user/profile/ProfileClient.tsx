"use client";

import { useState } from "react";
import { User as UserIcon, Shield, Bell, MapPin, Phone, Mail, Fingerprint, Save, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { updateProfileAction, toggleBiometricAction } from "./actions";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  isBiometricActive: boolean;
  createdAt: Date | string;
}

interface ProfileClientProps {
  user: UserData;
}

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState<"details" | "security" | "notifications">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Update local state to reflect changes
      setUser(prev => ({
        ...prev,
        name: formData.get("name") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
      }));
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile" });
    }
    setIsSubmitting(false);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    setIsSubmitting(true);
    setMessage(null);
    const result = await toggleBiometricAction(enabled);
    if (result.success) {
      setMessage({ type: "success", text: enabled ? "Biometrics registered!" : "Biometrics removed." });
      setUser(prev => ({ ...prev, isBiometricActive: enabled }));
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update biometric settings" });
    }
    setIsSubmitting(false);
  };

  const tabs = [
    { id: "details", label: "Profile Details", icon: UserIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#724A6A] text-white shadow-lg shadow-[#724A6A]/20 scale-[1.02]"
                : "text-[#4A4A6A] hover:bg-[#F5EDF4] hover:text-[#724A6A] active:scale-95"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E8E0D0] p-6 sm:p-10 shadow-2xl shadow-[#724A6A]/5">
          {message && (
            <div className={`mb-8 flex items-center gap-3 p-4 rounded-2xl text-sm font-medium animate-in zoom-in-95 duration-300 ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-100 shadow-sm shadow-green-100" 
                : "bg-red-50 text-red-700 border border-red-100 shadow-sm shadow-red-100"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-red-500" />}
              {message.text}
            </div>
          )}

          {activeTab === "details" && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#724A6A] to-[#A37B9B] flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-2xl ring-4 ring-white transition-transform group-hover:scale-105 duration-500">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-xl border border-[#E8E0D0] text-[#724A6A] hover:bg-[#724A6A] hover:text-white transition-all transform hover:rotate-12">
                    <UserIcon size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1A1A2E]">{user.name || "Anonymous User"}</h3>
                  <p className="text-sm text-[#8A8AAA] font-medium mt-1">
                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wider">Full Name</label>
                  <input
                    name="name"
                    defaultValue={user.name || ""}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E8E0D0] bg-[#FDFBF7] text-[#1A1A2E] placeholder:text-[#C0B7A5] focus:ring-2 focus:ring-[#724A6A]/20 focus:border-[#724A6A] outline-none transition-all font-medium"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wider flex items-center gap-2">
                    <Mail size={12} className="text-[#8A8AAA]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wider flex items-center gap-2">
                    <Phone size={12} className="text-[#8A8AAA]" /> Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    defaultValue={user.phoneNumber || ""}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E8E0D0] bg-[#FDFBF7] text-[#1A1A2E] placeholder:text-[#C0B7A5] focus:ring-2 focus:ring-[#724A6A]/20 focus:border-[#724A6A] outline-none transition-all font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={12} className="text-[#8A8AAA]" /> Location
                  </label>
                  <input
                    name="location"
                    defaultValue={user.location || ""}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E8E0D0] bg-[#FDFBF7] text-[#1A1A2E] placeholder:text-[#C0B7A5] focus:ring-2 focus:ring-[#724A6A]/20 focus:border-[#724A6A] outline-none transition-all font-medium"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#4A4A6A] uppercase tracking-wider">Short Bio</label>
                <textarea
                  name="bio"
                  defaultValue={user.bio || ""}
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E8E0D0] bg-[#FDFBF7] text-[#1A1A2E] placeholder:text-[#C0B7A5] focus:ring-2 focus:ring-[#724A6A]/20 focus:border-[#724A6A] outline-none transition-all font-medium resize-none"
                  placeholder="Share a little bit about yourself, your hobbies, or what you're looking for..."
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#724A6A] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#724A6A]/20 hover:bg-[#5D3C56] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSubmitting ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div className="space-y-10">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                  <Shield size={24} className="text-[#724A6A]" /> Security & Access
                </h3>
                <p className="text-sm text-[#4A4A6A] font-medium">Manage your authentication methods and session security.</p>
              </div>

              <div className="bg-[#FFFBE9]/50 border border-[#E8E0D0] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-lg hover:shadow-[#F2E8CF]/20 transition-all duration-500">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl transition-colors duration-500 ${user.isBiometricActive ? "bg-green-100 text-green-600" : "bg-[#724A6A]/10 text-[#724A6A]"}`}>
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A2E] text-lg">Biometric Authentication</h4>
                    <p className="text-sm text-[#8A8AAA] font-medium max-w-[320px]">Securely sign in using Touch ID, Face ID, or Windows Hello on supported devices.</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  <button
                    onClick={() => handleBiometricToggle(!user.isBiometricActive)}
                    disabled={isSubmitting}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#724A6A] focus:ring-offset-2 ${
                      user.isBiometricActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                        user.isBiometricActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.isBiometricActive ? "text-green-600" : "text-[#8A8AAA]"}`}>
                    {user.isBiometricActive ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1A1A2E]">Active Sessions</h4>
                  <button className="text-xs font-bold text-[#C62828] hover:text-red-700 transition-colors uppercase tracking-tight flex items-center gap-1">
                    <LogOut size={12} /> Log out all other devices
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8E0D0] bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75" />
                      </div>
                      <div>
                        <span className="text-[#1A1A2E] font-bold text-sm block">Current Browser (MacBook Pro)</span>
                        <span className="text-[10px] text-[#8A8AAA] font-bold uppercase tracking-wide">California, United States • Online Now</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-md border border-green-100 uppercase">Primary</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                  <Bell size={24} className="text-[#724A6A]" /> Notification Preferences
                </h3>
                <p className="text-sm text-[#4A4A6A] font-medium">Choose how you want to be notified about your upcoming bookings and account activity.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "email", label: "Email Notifications", desc: "Receive summary updates and booking confirmations directly in your inbox." },
                  { id: "sms", label: "SMS Alerts", desc: "Get real-time text message alerts for time-sensitive booking reminders." },
                  { id: "push", label: "Browser Push", desc: "Enable browser notifications to stay updated while you're browsing the platform." },
                ].map((pref) => (
                  <div key={pref.id} className="group flex items-center justify-between p-6 rounded-2xl border border-[#E8E0D0] bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-[#724A6A]/5 transition-all duration-300">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-[#1A1A2E]">{pref.label}</h4>
                      <p className="text-xs text-[#8A8AAA] font-medium max-w-[340px] leading-relaxed">{pref.desc}</p>
                    </div>
                    <button
                      className="relative inline-flex h-7 w-12 items-center rounded-full bg-green-500 shadow-inner transition-all hover:scale-110 active:scale-95"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md translate-x-6 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-6 rounded-2xl bg-[#724A6A]/5 border border-dashed border-[#724A6A]/20">
                <p className="text-xs text-[#724A6A] font-medium text-center">
                  Psst! You can also manage granular notification rules for specific services in your booking dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
