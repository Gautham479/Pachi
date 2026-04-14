import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureProductsSeeded } from '@/lib/productService';
import { DEFAULT_PRODUCTS } from '@/lib/defaultProducts';

export async function GET(request) {
  try {
    await ensureProductsSeeded();

    const { searchParams } = new URL(request.url);
    const includeOutOfStock = searchParams.get('includeOutOfStock') === '1';

    const products = await prisma.product.findMany({
      where: includeOutOfStock ? {} : { inStock: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!products.length && process.env.NODE_ENV !== 'production') {
      return NextResponse.json(DEFAULT_PRODUCTS);
    }

    return NextResponse.json(products);
  } catch (error) {
    // Fallback for environments without persistent/local DB support.
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(DEFAULT_PRODUCTS);
    }

    const details = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json({ error: `Failed to load products. ${details}` }, { status: 500 });
  }
}
