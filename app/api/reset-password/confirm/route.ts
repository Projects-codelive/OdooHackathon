import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, encryptPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    console.log("Verifying OTP:", otp, "for email:", email);

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token: otp,
        user: { email },
        used: false,
        expires: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!passwordReset) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    console.log("OTP verified for user:", passwordReset.user.email);

    const hashedPassword = await hashPassword(newPassword);
    const encryptedPassword = encryptPassword(newPassword);

    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: {
        hashedPassword,
        encryptedPassword,
      },
    });

    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
