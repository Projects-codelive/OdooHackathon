import AuthCard from "@/components/auth/AuthCard";
import ConfirmResetForm from "@/components/auth/ConfirmResetForm";

export default function ConfirmResetPage() {
  return (
    <AuthCard title="Enter OTP">
      <ConfirmResetForm />
    </AuthCard>
  );
}
