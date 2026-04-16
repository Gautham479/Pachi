import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Returning the order to the frontend
    return NextResponse.json({ order, success: true });

  } catch (error) {
    console.error("Fetch Order Error:", error);
    return NextResponse.json({ error: 'An internal error occurred retrieving order details' }, { status: 500 });
  }
}
