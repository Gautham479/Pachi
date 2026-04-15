import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock_success, internal_order_id } = body;

    // Handle DEBUG modes where Razorpay keys weren't set yet
    if (mock_success && internal_order_id) {
      await updateOrderStatus(internal_order_id, 'PAID', razorpay_payment_id || 'DEBUG_PAY_ID', razorpay_signature || 'DEBUG_SIG');
      return NextResponse.json({ success: true, message: "Payment verified (DEBUG MODE)" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret is not configured' }, { status: 500 });
    }

    // Verify Signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Find the order using razorpay_order_id
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      await updateOrderStatus(order.id, 'PAID', razorpay_payment_id, razorpay_signature);
      
      return NextResponse.json({ success: true, message: "Payment verified successfully", orderId: order.orderId });
    } else {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: 'An internal error occurred during payment verification' }, { status: 500 });
  }
}

// Helper to update DB and hook into Email
async function updateOrderStatus(id, status, paymentId, signature) {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    },
    include: { items: true } // fetch items if needed for email
  });

  if (status === 'PAID') {
    // ==========================================
    // TODO: Connect email sending hook here
    // Next Step Integration Anchor
    // ==========================================
    console.log(`[EMAIL HOOK PREP] Payment successful for order ${updatedOrder.orderId}. Customer: ${updatedOrder.email}`);
  }
}
