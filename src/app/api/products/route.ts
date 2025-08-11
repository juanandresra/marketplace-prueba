import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const postSchema = yup.object({
    title: yup.string().min(2).max(100).required(),
    description: yup.string().min(10).max(1000).required(),
    image: yup.string().url().required(),
    storeId: yup.string().uuid().required(),
    price: yup.number().min(0).required()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);    
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });
    const data = await postSchema.validate(await request.json(), { abortEarly: false });
    const store = await prisma.store.findUnique({ where: { id: data.storeId, businessId: session.user.id } });
    if (!store) return NextResponse.json({ errors: ["Store not found"] }, { status: 404 });
    const product = await prisma.product.create({ 
        data: {
            title: data.title,
            description: data.description,
            image: data.image,
            storeId: data.storeId,
            price: data.price
        }
     });
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof yup.ValidationError) return NextResponse.json({ errors: error.errors }, { status: 400 });
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}
