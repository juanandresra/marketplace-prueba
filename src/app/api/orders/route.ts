import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Esquema de validación para crear una orden
const orderSchema = yup.object({
  items: yup.array().of(
    yup.object({
      productId: yup.string().uuid().required(),
      quantity: yup.number().min(1).required(),
      unitPrice: yup.number().min(0).required(),
    })
  ).min(1).required()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ errors: ["Unauthorized"] }, { status: 401 });
    const data = await orderSchema.validate(await request.json(), { abortEarly: false });
    
    // Crear la orden y los items en una transacción
    const order = await prisma.order.create({
      data: {
        clientId: session.user.id,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof yup.ValidationError) return NextResponse.json({ errors: error.errors }, { status: 400 });
    return NextResponse.json({ errors: ["Internal Server Error"] }, { status: 500 });
  }
}
