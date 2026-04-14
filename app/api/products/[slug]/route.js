import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureProductsSeeded } from '@/lib/productService';

export async function GET(_, { params }) {
  await ensureProductsSeeded();
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
