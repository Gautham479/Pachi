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

    return NextResponse.json(products);
  } catch {
    // Fallback for environments without persistent/local DB support.
    return NextResponse.json(DEFAULT_PRODUCTS);
  }
}
