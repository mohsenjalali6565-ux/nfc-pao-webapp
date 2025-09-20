import { supabaseAdmin } from '@/lib/db'
import ProductView from '@/components/ProductView'

type ParamsObj = { tagId: string }

async function resolveParams(paramsOrPromise: ParamsObj | Promise<ParamsObj>) {
  return 'then' in (paramsOrPromise as any)
    ? await (paramsOrPromise as Promise<ParamsObj>)
    : (paramsOrPromise as ParamsObj)
}

export default async function ProductPage(props: { params: ParamsObj } | { params: Promise<ParamsObj> }) {
  const { tagId } = await resolveParams((props as any).params)

  const { data: tag } = await supabaseAdmin
    .from('tags')
    .select('tag_code, tamper_state, opened_at, batch_id, products(name, pao_months)')
    .eq('tag_code', tagId)
    .single()

  if (!tag) return <div className="p-8">Tag not found</div>

  return <ProductView tag={tag as any} />
}