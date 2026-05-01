import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Reset password request for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent" },
        { status: 200 }
      );
    }

    await prisma.passwordReset.deleteMany({
      where: { userId: user.id, used: false },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    console.log("Generated OTP:", otp, "for user:", user.email);

    await prisma.passwordReset.create({
      data: {
        token: otp,
        userId: user.id,
        expires,
      },
    });

    console.log("Password reset record created in DB");

    await sendResetEmail(email, otp);

    console.log("OTP email sent to:", email);

    return NextResponse.json(
      { message: "Check your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
