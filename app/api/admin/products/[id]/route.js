import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { MATERIAL_TYPES, PRODUCT_TYPES } from '@/lib/catalog';

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function PATCH(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (body.material && !MATERIAL_TYPES.includes(body.material)) {
    return NextResponse.json({ error: 'Invalid material type' }, { status: 400 });
  }

  if (body.type && !PRODUCT_TYPES.includes(body.type)) {
    return NextResponse.json({ error: 'Invalid category type' }, { status: 400 });
  }

  const updates = { ...body };
  if (typeof updates.price !== 'undefined') {
    updates.price = Number(updates.price);
    if (Number.isNaN(updates.price) || updates.price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown update error';
    return NextResponse.json({ error: `Update failed. ${details}` }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown delete error';
    return NextResponse.json({ error: `Delete failed. ${details}` }, { status: 500 });
  }
}
