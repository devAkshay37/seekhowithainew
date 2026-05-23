import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, ArrowRight, ArrowDown } from "lucide-react";
import ToolsDashboardSection from "@/components/tools/dashboard/ToolsDashboardSection";
import type { Profile } from "@/types";
import Image from "next/image";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const toolTypeLabels: Record<string, string> = {
  teachpack: "TeachPack",
  lastminprep: "Last Min Prep",
  mindmap: "Mindmap",
  quiz: "Quiz",
  activity: "Activity",
};

const toolTypeHref: Record<string, string> = {
  teachpack: "/app/teachpack",
  lastminprep: "/app/lastminprep",
  mindmap: "/app/mindmap",
  quiz: "/app/quiz",
  activity: "/app/activity",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, board, classes, subjects, language_preference")
    .eq("id", user.id)
    .single();

  // Fetch recent items across all tools
  const [
    { data: packs },
    { data: preps },
    { data: maps },
    { data: quizzes },
    { data: activities },
  ] = await Promise.all([
    supabase
      .from("teachpacks")
      .select("id, topic, subject, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("lastminpreps")
      .select("id, topic, subject, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("mindmaps")
      .select("id, topic, subject, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("quizzes")
      .select("id, subject, created_at, topics")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("activities")
      .select("id, topic, subject, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const recent = [
    ...(packs || []).map((p) => ({ ...p, type: "teachpack", title: p.topic })),
    ...(preps || []).map((p) => ({
      ...p,
      type: "lastminprep",
      title: p.topic,
    })),
    ...(maps || []).map((m) => ({ ...m, type: "mindmap", title: m.topic })),
    ...(quizzes || []).map((q) => ({
      ...q,
      type: "quiz",
      title: q.topics?.[0] || q.subject,
    })),
    ...(activities || []).map((a) => ({
      ...a,
      type: "activity",
      title: a.topic,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-[90%] mx-auto">
      {/* Header */}
      {/* <EducationBanner /> */}
      <div className="flex justify-center items-center pt-5 lg:pt-24 relative">
        <ToolsDashboardSection profile={profile as Profile} />
      </div>

      {/* Recent Items */}
      <section className="mt-2">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* LEFT: Recent */}
          {/* <div className="w-full lg:w-1/2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-jakarta font-semibold text-lg text-[#0F0F1A]">
                Recent
              </h2>
            </div>

            {recent.length === 0 ? (
              <div className="border-2 border-dashed border-[#E0E0EC] rounded-2xl p-10 text-center">
                <BookOpen className="w-10 h-10 text-[#E0E0EC] mx-auto mb-3" />
                <p className="font-jakarta font-semibold text-[#0F0F1A] mb-1">
                  Nothing here yet
                </p>
                <p className="text-[#6B6B8A] text-sm mb-4">
                  Create your first TeachPack to get started.
                </p>
                <Link
                  href="/app/teachpack/new"
                  className="inline-flex items-center gap-2 bg-[#E85D1E] text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-[#d05018] transition-colors"
                >
                  Create TeachPack <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={`${toolTypeHref[item.type]}/${item.id}`}
                    className="flex items-center gap-4 bg-white border border-[#E0E0EC] rounded-xl px-4 py-3.5 hover:shadow-sm hover:border-[#E85D1E]/30 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#0F0F1A] text-sm truncate">
                        {item.title}
                      </p>
                      <p className="text-[#6B6B8A] text-xs mt-0.5">
                        {toolTypeLabels[item.type]} ·{" "}
                        {"subject" in item && item.subject
                          ? `${item.subject} · `
                          : ""}
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B6B8A]" />
                  </Link>
                ))}
              </div>
            )}
          </div> */}

          {/* RIGHT: Teaching Progress */}
          {/* <div className="bg-white border border-[#E0E0EC] rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#0F0F1A]">
          Your Teaching Progress
        </h3>
        <span className="text-sm text-[#6B6B8A]">This week</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#F6F4FF] p-3 rounded-xl text-center">
          <p className="text-lg font-bold">12</p>
          <p className="text-xs text-[#6B6B8A]">Lessons</p>
        </div>
        <div className="bg-[#F0FDF4] p-3 rounded-xl text-center">
          <p className="text-lg font-bold">8</p>
          <p className="text-xs text-[#6B6B8A]">Quizzes</p>
        </div>
        <div className="bg-[#FFF7ED] p-3 rounded-xl text-center">
          <p className="text-lg font-bold">6</p>
          <p className="text-xs text-[#6B6B8A]">Activities</p>
        </div>
        <div className="bg-[#EFF6FF] p-3 rounded-xl text-center">
          <p className="text-lg font-bold">95%</p>
          <p className="text-xs text-[#6B6B8A]">Engagement</p>
        </div>
      </div>

      <div className="bg-[#FFF7ED] border rounded-xl p-4">
        <p className="font-medium text-sm mb-1">
          Amazing! You're on a 5-day streak 🔥
        </p>
        <p className="text-xs text-[#6B6B8A] mb-3">
          Keep going, you're inspiring young minds.
        </p>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className="w-6 h-6 rounded-full bg-green-500"
            />
          ))}
          <div className="w-6 h-6 rounded-full border text-xs flex items-center justify-center">
            6
          </div>
        </div>
      </div>
    </div> */}
        </div>
      </section>
    </div>
  );
}
