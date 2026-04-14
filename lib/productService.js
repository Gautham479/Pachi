import { prisma } from '@/lib/prisma';
import { DEFAULT_PRODUCTS } from '@/lib/defaultProducts';

let seedPromise = null;

export async function ensureProductsSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const count = await prisma.product.count();
      if (count === 0) {
        await prisma.product.createMany({ data: DEFAULT_PRODUCTS });
      }
    })();
  }

  await seedPromise;
}
