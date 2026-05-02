import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function UserLoginPage() {
  return (
    <AuthCard title="User Login">
      <LoginForm roleDisplay="User" />
    </AuthCard>
  );
}
