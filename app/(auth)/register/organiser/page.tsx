import AuthCard from "@/app/(auth)/_components/AuthCard";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

export default function OrganizerRegisterPage() {
  return (
    <AuthCard title="Create Business Account">
      <RegisterForm fixedRole="ORGANIZER" />
    {/* Optionally add marketing CTA or description here */}
    </AuthCard>
  );
}
