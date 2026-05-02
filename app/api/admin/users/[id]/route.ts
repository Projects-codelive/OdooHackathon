import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const body = await req.json();
    const { role, isActive, name } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(name && { name }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("ADMIN_USER_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_USER_DELETE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
