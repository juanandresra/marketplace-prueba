import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


const putSchema = yup.object({
  name: yup.string().min(2).max(100),
  description: yup.string().min(10).max(1000),
  image: yup.string().url()
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> } ) {
  try {

      const { id } = await context.params; // ✅ need `await` now

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });

  
    const data = await putSchema.validate(await request.json(), { abortEarly: false });

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) return NextResponse.json({ errors: ["Store not found"] }, { status: 404 });

    if (store.businessId !== session.user.id) {
      return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Error updating store:", error);
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    console.log('Delete store');
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });

    const { id } = await context.params;

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) return NextResponse.json({ errors: ["Store not found"] }, { status: 404 });

    if (store.businessId !== session.user.id) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });

    await prisma.store.delete({ where: { id } });
    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}
