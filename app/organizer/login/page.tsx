import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function OrganizerLoginPage() {
  return (
    <AuthCard title="Organizer Login">
      <LoginForm roleDisplay="Organizer" />
    </AuthCard>
  );
}
