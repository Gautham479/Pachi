import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { saveProductImages } from '@/lib/uploadImage';

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function POST(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const files = formData.getAll('imageFiles');
  if (!files.length) {
    return NextResponse.json({ error: 'No images selected' }, { status: 400 });
  }

  try {
    const uploadedUrls = await saveProductImages(files);
    if (!uploadedUrls.length) {
      return NextResponse.json({ error: 'No valid images uploaded' }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const mergedImages = [...(existing.images || []), ...uploadedUrls];
    const updated = await prisma.product.update({
      where: { id },
      data: {
        images: mergedImages,
        image: existing.image || mergedImages[0] || '',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown image append error';
    return NextResponse.json({ error: `Add images failed. ${details}` }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !body.imageUrl) {
    return NextResponse.json({ error: 'Valid imageUrl required' }, { status: 400 });
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const newImages = (existing.images || []).filter(url => url !== body.imageUrl);
    const newPrimaryImage = existing.image === body.imageUrl 
      ? (newImages[0] || '') 
      : existing.image;

    const updated = await prisma.product.update({
      where: { id },
      data: { images: newImages, image: newPrimaryImage }
    });

    // Delete from Supabase bucket
    const { deleteProductImages } = require('@/lib/uploadImage');
    await deleteProductImages([body.imageUrl]);

    return NextResponse.json(updated);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown delete error';
    return NextResponse.json({ error: `Delete image failed. ${details}` }, { status: 500 });
  }
}
