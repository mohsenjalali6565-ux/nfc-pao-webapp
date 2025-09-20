import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseServer';
import { getPAOEndDate } from '@/lib/pao';
import ProductView from '@/components/ProductView'; // این خط را اصلاح کنید

export default async function ProductPage({
  params,
}: {
  params: { tagId: string };
}) {
  const { tagId } = params;

  const { data: tag, error } = await supabase
    .from('tags')
    .select('*, product:product_id(*), batch:batch_id(*)')
    .eq('id', tagId)
    .single();

  if (error || !tag) {
    return notFound();
  }

  if (tag.tamper_state === 'intact') {
    const { error: updateError } = await supabase
      .from('tags')
      .update({
        tamper_state: 'opened',
        opened_at: new Date().toISOString(),
      })
      .eq('id', tagId);
    if (updateError) console.error('Error updating tag state:', updateError);
  }

  const { product, opened_at } = tag;

  const paoEndDate = opened_at
    ? getPAOEndDate(opened_at, product?.pao_months || 0)
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {product?.name || 'Unknown Product'}
        </h1>
        <p className="text-gray-600 mb-4">
          Batch Number: {tag?.batch?.lot_code || 'N/A'}
        </p>
        {paoEndDate ? (
          <ProductView status="opened" openedAt={opened_at} paoEndDate={paoEndDate.toISOString()} />
        ) : (
          <ProductView status="intact" />
        )}
      </div>
    </div>
  );
}

export const revalidate = 0;
