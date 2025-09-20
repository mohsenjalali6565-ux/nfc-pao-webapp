
"use client";

import React from "react";

type Product = {
  name?: string;
  sku?: string;
  pao_months?: number;
  attributes?: Record<string, any>;
  instructions_md?: string; // ⬅️ اضافه شد
};
type Batch = { lot_code?: string; mfg_date?: string; exp_date?: string };
type Tag = { tag_code?: string; tamper_state?: "unknown" | "intact" | "opened"; opened_at?: string };

type Props = {
  tag?: any;
  product?: Product;
  batch?: Batch;
  daysRemaining?: number;
};

const Pill = ({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green" | "red";
}) => {

  const styles =
    tone === "green"
      ? "bg-green-100 text-green-700"
      : tone === "red"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-sm ${styles}`}>{children}</span>;
};

/** یک رندر خیلی سبک Markdown: **bold** و خطجدید */
function mdLite(htmlish: string) {
  // escape
  const esc = htmlish
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // **bold**
  const bolded = esc.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // line breaks
  return bolded.replace(/\n/g, "<br/>");
}

export default function ProductView({ tag, product, batch, daysRemaining }: Props) {
  const mergedProduct: Product = {
    ...(tag?.products ?? {}),
    ...(product ?? {}),
  };

  const mergedBatch: Batch = {
    ...(tag?.batches ?? {}),
    ...(batch ?? {}),
  };

  const name = mergedProduct?.name ?? "—";
  const paoMonths = mergedProduct?.pao_months ?? 0;
  const lot = mergedBatch?.lot_code ?? "";
  const mfg = mergedBatch?.mfg_date ?? undefined;
  const exp = mergedBatch?.exp_date ?? undefined;

  const tagCode = tag?.tag_code ?? "";
  const tamper: Tag["tamper_state"] = (tag?.tamper_state as any) ?? "unknown";
  const openedAt: string | undefined = tag?.opened_at ?? undefined;

  const attributes = mergedProduct?.attributes ?? undefined;
  const instructions = mergedProduct?.instructions_md?.trim();

  return (
    <div className="max-w-xl mx-auto p-5">
      <div className="rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-6">
          <h1 className="text-2xl font-bold leading-tight">{name}</h1>

          {lot ? <p className="opacity-90 text-sm mt-1">Lot: {lot}</p> : null}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Tag + State */}
          {(tagCode || tamper) && (
            <div className="flex flex-wrap items-center gap-3">
              {tagCode && (
                <div className="text-sm">
                  <span className="font-medium">Tag:</span> <Pill tone="gray">{tagCode}</Pill>
                </div>
              )}
              {tamper === "opened" ? (
                <Pill tone="red">Opened</Pill>
              ) : tamper === "intact" ? (
                <Pill tone="green">Intact</Pill>
              ) : (
                <Pill tone="gray">Unknown</Pill>
              )}
              {openedAt && (
                <span className="text-xs text-gray-500">Opened at {new Date(openedAt).toLocaleString()}</span>
              )}
            </div>
          )}

          {/* PAO */}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border p-4">
              <div className="text-gray-500">PAO</div>
              <div className="font-semibold">{paoMonths} months</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-gray-500">Days remaining</div>
              <div className="font-semibold">{daysRemaining ?? "—"}</div>
            </div>
          </div>

          {/* MFG / EXP */}
          {(mfg || exp) && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {mfg && (
                <div className="rounded-xl border p-4">
                  <div className="text-gray-500">MFG</div>
                  <div className="font-semibold">{mfg}</div>
                </div>
              )}
              {exp && (
                <div className="rounded-xl border p-4">
                  <div className="text-gray-500">EXP</div>
                  <div className="font-semibold">{exp}</div>
                </div>
              )}
            </div>

          )}

          {/* Attributes */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="pt-4 border-t">
              <h2 className="text-base font-semibold mb-2">Product Details</h2>
              <ul className="space-y-1 text-sm">
                {Object.entries(attributes).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium capitalize">{k}:</span>{" "}
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions / How to use */}
          {instructions && (
            <div className="pt-4 border-t">
              <h2 className="text-base font-semibold mb-2">How to use</h2>
              <div
                className="text-sm text-gray-800 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: mdLite(instructions) }}
              />

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
