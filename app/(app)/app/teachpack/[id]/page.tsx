import { createClient } from "@/lib/supabase/server";
import { TeachPackDetailClient } from "@/components/tools/teachpack/TeachPackDetailClient";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { TeachPack, TeachPackFormInput } from "@/types";
import { PostHogTechpackTracker } from "./PostHogTechpackTracker";

export const dynamic = "force-dynamic";

export default async function TeachPackDetailPage({
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

  const { data: pack } = await supabase
    .from("teachpacks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!pack) notFound();

  const tp = pack as TeachPack;
  const formData: TeachPackFormInput = {
    board: tp.board || "CBSE",
    class: tp.class || "",
    subject: tp.subject || "",
    topic: tp.topic,
    number_of_lectures: tp.content.lectures?.length || 1,
    duration: (tp.duration as 30 | 45 | 60) || 45,
    language: (tp.language as TeachPackFormInput["language"]) || "English",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-3xl mx-auto">
      <PostHogTechpackTracker id={id} />
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            {tp.topic}
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Class {tp.class} · {tp.subject}
          </p>
        </div>
      </div>
      <TeachPackDetailClient pack={tp} formData={formData} />
    </div>
  );
}

