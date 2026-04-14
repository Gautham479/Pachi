import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { ensureProductsSeeded } from '@/lib/productService';
import { MATERIAL_TYPES, PRODUCT_TYPES } from '@/lib/catalog';

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await ensureProductsSeeded();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(products);
}

export async function POST(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const requiredFields = ['name', 'description', 'fullDescription', 'material', 'price', 'type'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (!MATERIAL_TYPES.includes(body.material)) {
    return NextResponse.json({ error: 'Invalid material type' }, { status: 400 });
  }

  if (!PRODUCT_TYPES.includes(body.type)) {
    return NextResponse.json({ error: 'Invalid category type' }, { status: 400 });
  }

  const price = Number(body.price);
  if (Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  const baseSlug = slugify(body.slug || body.name);
  let slug = baseSlug || `product-${Date.now()}`;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const created = await prisma.product.create({
    data: {
      slug,
      name: body.name.trim(),
      description: body.description.trim(),
      fullDescription: body.fullDescription.trim(),
      material: body.material,
      price,
      image: body.image || '',
      imageColor: body.imageColor || 'from-[#6366f1] to-[#8b5cf6]',
      type: body.type,
      dimensions: body.dimensions || 'N/A',
      weight: body.weight || 'N/A',
      printTime: body.printTime || 'N/A',
      inStock: body.inStock !== false,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
