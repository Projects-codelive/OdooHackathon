import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/services/user";
import ProfileClient from "./ProfileClient";

export default async function UserProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/user/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/user/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 reveal">
        <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">Account Settings</h1>
        <p className="text-[#4A4A6A] mt-1 italic">Manage your profile, security and preferences</p>
      </div>
      
      <ProfileClient user={user} />
    </div>
  );
}
