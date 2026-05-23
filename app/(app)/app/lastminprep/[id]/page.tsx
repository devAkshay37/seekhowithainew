import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LastMinPrep } from "@/types";

export const dynamic = "force-dynamic";

export default async function LastMinPrepDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: prep } = await supabase
    .from("lastminpreps")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!prep) notFound();
  const p = prep as LastMinPrep;

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/app"
          className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            {p.topic}
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Class {p.class} · {p.subject} · {p.depth}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold text-[#E85D1E] uppercase tracking-wide mb-2">
            Core Concept
          </p>
          <p className="text-sm text-[#0F0F1A] leading-relaxed">
            {p.content.core_concept}
          </p>
        </div>
        {p.content.key_points?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Key Points
            </p>
            <ul className="space-y-1.5">
              {p.content.key_points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-[#E85D1E] font-bold">•</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}
        {p.content.must_know_terms?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Must-Know Terms
            </p>
            <div className="space-y-2">
              {p.content.must_know_terms.map((item, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="font-semibold text-[#0F0F1A]">
                    {item.term}:
                  </span>
                  <span className="text-[#6B6B8A]">{item.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-[#f5ede0] border border-saffron/30 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#E85D1E] uppercase tracking-wide mb-1.5">
            Best Analogy
          </p>
          <p className="text-sm text-[#0F0F1A]">{p.content.best_analogy}</p>
        </div>
        {p.content.quick_questions?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Quick Questions
            </p>
            <ul className="space-y-1.5">
              {p.content.quick_questions.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="font-semibold text-[#E85D1E]">
                    Q{i + 1}.
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
        {p.content.teacher_notes && (
          <div className="border-t border-[#E0E0EC] pt-4">
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Teacher Notes
            </p>
            <p className="text-sm text-[#0F0F1A] leading-relaxed">
              {p.content.teacher_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
