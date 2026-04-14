import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';

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

  const safeName = sanitizeFileName(file.name || 'product-image.png');
  const fileName = `products/${Date.now()}-${safeName}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';

  const supabase = getSupabaseAdminClient();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data?.publicUrl || '';
}
