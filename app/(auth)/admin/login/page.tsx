import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <AuthCard title="Admin Login">
      <LoginForm roleDisplay="Admin" />
    </AuthCard>
  );
}
