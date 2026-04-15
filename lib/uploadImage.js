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

export async function saveProductImages(files) {
  const results = [];
  for (const file of files || []) {
    const imageUrl = await saveProductImage(file);
    if (imageUrl) {
      results.push(imageUrl);
    }
  }
  return results;
}

export async function deleteProductImages(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return;
  
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
  const supabase = getSupabaseAdminClient();
  
  const paths = imageUrls.map(url => {
    try {
      if (!url) return null;
      const bucketUrlPath = `/${bucket}/`;
      const index = url.indexOf(bucketUrlPath);
      if (index !== -1) {
        return url.substring(index + bucketUrlPath.length);
      }
      return null;
    } catch {
      return null;
    }
  }).filter(Boolean);

  if (paths.length > 0) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error('Supabase storage delete error:', error.message);
    }
  }
}
