import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Activity } from "@/types";

export const dynamic = "force-dynamic";

export default async function ActivityDetailPage({
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
  const { data: activity } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!activity) notFound();
  const a = activity as Activity;

  const sections = [
    {
      title: "🎯 Objectives",
      content: (
        <ul className="space-y-1.5">
          {a.content.objectives.map((o, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-[#E85D1E]">•</span>
              {o}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "🧠 SEL Structure",
      content: (
        <div>
          <p className="text-sm font-semibold text-[#0F0F1A] mb-1">
            {a.content.sel_structure.framework}
          </p>
          <p className="text-sm text-[#6B6B8A]">
            {a.content.sel_structure.description}
          </p>
        </div>
      ),
    },
    {
      title: "🌍 Real-World Connection",
      content: (
        <p className="text-sm text-[#0F0F1A]">
          {a.content.real_world_connection}
        </p>
      ),
    },
    {
      title: "📦 Materials",
      content: (
        <div className="flex flex-wrap gap-2">
          {a.content.materials_needed.map((m, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[#F5F5F7] text-[#0F0F1A] text-xs rounded-full border border-[#E0E0EC]"
            >
              {m}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "📋 Instructions",
      content: (
        <ol className="space-y-3">
          {a.content.instructions.map((inst, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="w-6 h-6 bg-[#E85D1E] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                {inst.step}
              </span>
              <span>{inst.instruction}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      title: "✅ Assessment",
      content: (
        <ul className="space-y-1.5">
          {a.content.assessment.criteria.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-teal">✓</span>
              {c}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/app"
          className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            {a.topic}
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Class {a.class} · {a.subject} · {a.activity_type} · {a.duration} min
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {sections.map(({ title, content }) => (
          <div
            key={title}
            className="bg-white border border-[#E0E0EC] rounded-2xl p-5"
          >
            <p className="font-jakarta font-semibold text-sm text-[#0F0F1A] mb-3">
              {title}
            </p>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
