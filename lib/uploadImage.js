import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

function sanitizeFileName(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
}

export async function saveProductImage(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    return '';
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (!buffer.length) {
    return '';
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const safeName = sanitizeFileName(file.name || 'product-image.png');
  const fileName = `${Date.now()}-${safeName}`;
  const fullPath = path.join(uploadsDir, fileName);

  await writeFile(fullPath, buffer);
  return `/uploads/${fileName}`;
}
