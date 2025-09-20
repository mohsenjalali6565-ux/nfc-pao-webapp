import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseServer';
import { getPAOEndDate } from '@/lib/pao';
import ProductView from '@/components/ProductView';

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { tagId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { tagId } = params;
  const tamperStateFromURL = searchParams.tt;

  const { data: tag, error } = await supabase
    .from('tags')
    .select('*, product:product_id(*), batch:batch_id(*)')
    .eq('id', tagId)
    .single();

  if (error || !tag) {
    return notFound();
  }

  // New logic: Only update the database if the URL indicates a tampered state (tt=1)
  // AND the database still shows the product as intact.
  if (tamperStateFromURL === '1' && tag.tamper_state === 'intact') {
    const { error: updateError } = await supabase
      .from('tags')
      .update({
        tamper_state: 'opened',
        opened_at: new Date().toISOString(),
      })
      .eq('id', tagId);
    if (updateError) console.error('Error updating tag state:', updateError);

    // Re-fetch the updated data to ensure the UI is in sync.
    const { data: updatedTag, error: fetchError } = await supabase
      .from('tags')
      .select('*, product:product_id(*), batch:batch_id(*)')
      .eq('id', tagId)
      .single();
    if (fetchError || !updatedTag) {
      return notFound();
    }
    
    const paoEndDate = getPAOEndDate(updatedTag.opened_at, updatedTag.product?.pao_months || 0);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            {updatedTag.product?.name || 'Unknown Product'}
          </h1>
          <p className="text-gray-600 mb-4">
            Batch Number: {updatedTag.batch?.lot_code || 'N/A'}
          </p>
          <ProductView status="opened" openedAt={updatedTag.opened_at} paoEndDate={paoEndDate.toISOString()} />
        </div>
      </div>
    );
  }

  // This part of the code handles two scenarios:
  // 1. The tag is intact (tt=0) and has never been scanned before.
  // 2. The tag was tampered with and scanned before, so the database is already 'opened'.
  const paoEndDate = tag.opened_at
    ? getPAOEndDate(tag.opened_at, tag.product?.pao_months || 0)
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {tag.product?.name || 'Unknown Product'}
        </h1>
        <p className="text-gray-600 mb-4">
          Batch Number: {tag.batch?.lot_code || 'N/A'}
        </p>
        {paoEndDate ? (
          <ProductView status="opened" openedAt={tag.opened_at} paoEndDate={paoEndDate.toISOString()} />
        ) : (
          <ProductView status="intact" />
        )}
      </div>
    </div>
  );
}

export const revalidate = 0;
