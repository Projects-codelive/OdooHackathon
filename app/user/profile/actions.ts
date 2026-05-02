'use server'
import { auth } from "@/auth";
import { updateUserProfile, registerBiometric, unregisterBiometric } from "@/services/user";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "./schema";

export async function updateProfileAction(formData: FormData) {

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    bio: formData.get("bio") as string,
    location: formData.get("location") as string,
  };

  const validatedData = ProfileSchema.safeParse(rawData);
  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.issues[0].message
    };
  }

  try {
    // Convert null to undefined for service compatibility
    const profileData = {
      name: validatedData.data.name,
      phoneNumber: validatedData.data.phoneNumber ?? undefined,
      bio: validatedData.data.bio ?? undefined,
      location: validatedData.data.location ?? undefined,
    };
    await updateUserProfile(session.user.id, profileData);
    revalidatePath("/user/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function toggleBiometricAction(enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (enabled) {
      // In a real app, you'd verify a passkey here. 
      const simulatedBiometricId = `bio_${Math.random().toString(36).substring(7)}`;
      await registerBiometric(session.user.id, simulatedBiometricId);
    } else {
      await unregisterBiometric(session.user.id);
    }
    revalidatePath("/user/profile");
    return { success: true };
  } catch (error) {
    console.error("Biometric toggle error:", error);
    return { success: false, error: "Failed to update biometric settings" };
  }
}
