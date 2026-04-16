import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, customerName, email, phone, address1, address2, notes, city, state, pincode } = body;

    let compiledAddress = address1 || '';
    if (address2) compiledAddress += `, ${address2}`;
    if (notes) compiledAddress += ` | Notes: ${notes}`;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals securely
    const subtotal = items.reduce((acc, item) => acc + item.price, 0);
    const deliveryFee = 0; // Delivery charges removed for now
    const totalAmount = subtotal + deliveryFee;

    // Generate readable order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // Initialize Razorpay Order if keys exist
    let razorpayOrderId = `DEBUG_ORD_${Date.now()}`;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: totalAmount * 100, // amount in the smallest currency unit (paisa)
        currency: "INR",
        receipt: orderId,
      };

      try {
        const order = await razorpay.orders.create(options);
        razorpayOrderId = order.id;
      } catch (rzpErr) {
        console.error("Razorpay Error:", rzpErr);
        return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 500 });
      }
    }

    // Create Order in DB
    const dbOrder = await prisma.order.create({
      data: {
        orderId,
        customerName,
        email,
        phone,
        address: compiledAddress,
        city,
        state,
        pincode,
        totalAmount,
        deliveryFee,
        status: 'PENDING',
        razorpayOrderId,
        items: {
          create: items.map(item => ({
            fileName: item.fileName,
            price: item.price,
            material: item.config?.material || 'Unknown',
            color: item.config?.color || 'Unknown',
            colorMode: item.config?.colorMode || 'Single Color',
            quality: item.config?.quality || 'Unknown',
            strength: item.config?.strength || 20,
          }))
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      orderId: dbOrder.orderId,
      razorpayOrderId, 
      amount: totalAmount, 
      currency: "INR" 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'An internal error occurred during checkout' }, { status: 500 });
  }
}
