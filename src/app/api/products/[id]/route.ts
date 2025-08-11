import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const putSchema = yup.object({
  title: yup.string().min(2).max(100),
  description: yup.string().min(10).max(1000),
  image: yup.string().url(),
  price: yup.number().min(0)
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });

    const data = await putSchema.validate(await request.json(), { abortEarly: false });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { store: true }
    });

    if (!product) return NextResponse.json({ errors: ["Product not found"] }, { status: 404 });

    if (product.store.businessId !== session.user.id) {
      return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Error updating product:", error);
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { store: true }
    });

    if (!product) return NextResponse.json({ errors: ["Product not found"] }, { status: 404 });

    if (product.store.businessId !== session.user.id) {
      return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}
