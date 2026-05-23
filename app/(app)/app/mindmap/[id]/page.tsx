import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MindmapCanvas } from "@/components/tools/mindmap/MindmapCanvas";
import type { Mindmap } from "@/types";

export const dynamic = "force-dynamic";

export default async function MindmapDetailPage({
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
  const { data: map } = await supabase
    .from("mindmaps")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!map) notFound();
  const m = map as Mindmap;

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            {m.topic}
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Class {m.class} · {m.subject} · {m.depth}
          </p>
        </div>
      </div>
      <MindmapCanvas content={m.content} />
    </div>
  );
}
