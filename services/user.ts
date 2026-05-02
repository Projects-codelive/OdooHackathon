import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUserProfile(id: string, data: {
  name?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
}) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function registerBiometric(id: string, biometricId: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      biometricId,
      isBiometricActive: true,
    },
  });
}

export async function unregisterBiometric(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      biometricId: null,
      isBiometricActive: false,
    },
  });
}
