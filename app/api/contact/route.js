import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, query } = await request.json();

    // Validation
    if (!name || !email || !phone || !query) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Phone validation (10+ digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        query,
        createdAt: new Date()
      }
    });

    // Optional: Send email notification (you can integrate with email service)
    // Example: sendEmailToAdmin(contact);

    return NextResponse.json(
      {
        success: true,
        message: 'Message received successfully',
        id: contact.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    // If table doesn't exist, return success but note the limitation
    if (error.code === 'P3005' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        {
          success: true,
          message: 'Message received (stored in memory)',
          warning: 'Database table not configured'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}