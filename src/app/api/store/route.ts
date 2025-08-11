import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const postSchema = yup.object({
    name: yup.string().min(2).max(100).required(),
    description: yup.string().min(10).max(1000).required(),
    image: yup.string().url().required()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);    
    if (!session) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    if (!session.user?.roles?.includes("BUSINESS")) return NextResponse.json({ errors: ["Forbidden"] }, { status: 403 });
    const data = await postSchema.validate(await request.json(), { abortEarly: false });
    const store = await prisma.store.create({ 
        data: {
            name: data.name,
            description: data.description,
            image: data.image,
            businessId: session.user.id,
        }
     });
    return NextResponse.json(store);
  } catch (error) {
    if (error instanceof yup.ValidationError) return NextResponse.json({ errors: error.errors }, { status: 400 });
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}
