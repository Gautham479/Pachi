import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureProductsSeeded } from '@/lib/productService';
import { DEFAULT_PRODUCTS } from '@/lib/defaultProducts';

export async function GET(_, { params }) {
  const { slug } = await params;
  try {
    await ensureProductsSeeded();

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      const details = error instanceof Error ? error.message : 'Unknown database error';
      return NextResponse.json({ error: `Failed to load product. ${details}` }, { status: 500 });
    }

    const fallbackProduct = DEFAULT_PRODUCTS.find((product) => product.slug === slug);
    if (!fallbackProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(fallbackProduct);
  }
}
