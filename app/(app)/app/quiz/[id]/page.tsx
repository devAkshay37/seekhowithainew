import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Quiz } from "@/types";
import { QuizDetailClient } from "@/components/tools/quiz/QuizDetailClient";

export const dynamic = "force-dynamic";

export default async function QuizDetailPage({
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
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!quiz) notFound();
  const q = quiz as Quiz;

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A] cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">Quiz / Test Paper</h1>
          <p className="text-sm text-[#6B6B8A]">Class {q.class} · {q.subject}</p>
        </div>
      </div>
      <QuizDetailClient quiz={q} />
    </div>
  );
}
