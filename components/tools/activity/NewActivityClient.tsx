"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GeneratingAnimation } from "@/components/shared/GeneratingAnimation";
import type { ActivityContent, Profile } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicSuggestions } from "@/components/tools/shared/TopicSuggestions";

const DURATIONS = [10, 15, 20, 30] as const;

interface Props {
  profile: Profile;
}

export default function NewActivityClient({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"form" | "generating" | "result">(
    "form",
  );
  const [content, setContent] = useState<ActivityContent | null>(null);
  const [form, setForm] = useState({
    class: profile.classes?.[0] || "8",
    subject: profile.subjects?.[0] || "Science",
    topic: "",
    activity_type: "solo" as "solo" | "group",
    group_size: "4-5" as "2-3" | "4-5" | "6+",
    duration: 20 as 10 | 15 | 20 | 30,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("generating");
    setError("");
    try {
      const body = {
        ...form,
        group_size:
          form.activity_type === "group" ? form.group_size : undefined,
      };
      const res = await fetch("/api/generate/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      const { content: c } = await res.json();
      setContent(c);
      setStatus("result");
    } catch {
      setError("Generation failed. Try again.");
      setStatus("form");
    }
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("activities")
        .insert({
          user_id: user!.id,
          class: form.class,
          subject: form.subject,
          topic: form.topic,
          activity_type: form.activity_type,
          group_size: form.activity_type === "group" ? form.group_size : null,
          duration: form.duration,
          content,
          is_starred: false,
        })
        .select()
        .single();
      if (data) router.push(`/app/activity/${data.id}`);
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto pt-20 md:pt-0">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/app"
          className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            Activity Generator
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            SEL-structured classroom activities
          </p>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {status === "form" && (
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-2xl border border-[#E0E0EC] p-6 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
                Class
              </label>

              <Select
                value={form.class}
                onValueChange={(value) => {
                  const isPrimary = ["1", "2", "3", "4", "5"].includes(value);
                  const newSubject =
                    form.subject === "EVS" && !isPrimary
                      ? "Science"
                      : form.subject;

                  setForm({ ...form, class: value, subject: newSubject });
                }}
              >
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
                Subject
              </label>

              <Select
                value={form.subject}
                onValueChange={(value) => setForm({ ...form, subject: value })}
              >
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {(["1", "2", "3", "4", "5"].includes(form.class)
                    ? [
                        "Maths",
                        "EVS",
                        "Science",
                        "Hindi Vyakran",
                        "English Grammar",
                        "Computer",
                        "SST",
                        "Other",
                      ]
                    : [
                        "Maths",
                        "Science",
                        "Hindi Vyakran",
                        "English Grammar",
                        "Computer",
                        "SST",
                        "Other",
                      ]
                  ).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
              Topic *
            </label>
            <TopicSuggestions
              board={"NCERT"}
              classNum={form.class}
              subject={form.subject}
              value={form.topic}
              placeholder="e.g. Water Cycle"
              className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]"
              onSelectTopic={(topic) => setForm({ ...form, topic })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-2">
              Activity Type
            </label>
            <div className="flex gap-2">
              {(["solo", "group"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, activity_type: t })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border capitalize transition-colors ${form.activity_type === t ? "bg-[#E85D1E] text-white border-[#E85D1E]" : "border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {form.activity_type === "group" && (
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-2">
                Group Size
              </label>
              <div className="flex gap-2">
                {(["2-3", "4-5", "6+"] as const).map((gs) => (
                  <button
                    key={gs}
                    type="button"
                    onClick={() => setForm({ ...form, group_size: gs })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.group_size === gs ? "bg-[#E85D1E] text-white border-[#E85D1E]" : "border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50"}`}
                  >
                    {gs}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-2">
              Duration
            </label>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, duration: d })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.duration === d ? "bg-[#E85D1E] text-white border-[#E85D1E]" : "border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50"}`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!form.topic.trim()}
            className="w-full bg-[#E85D1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
          >
            🎯 Generate Activity
          </button>
        </form>
      )}
      {status === "generating" && (
        <GeneratingAnimation
          labels={[
            "Designing objectives…",
            "Building SEL structure…",
            "Writing instructions…",
            "Creating assessment…",
          ]}
        />
      )}
      {status === "result" && content && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-jakarta font-bold text-[#0F0F1A]">
                {form.topic}
              </h2>
              <p className="text-sm text-[#6B6B8A]">
                Class {form.class} · {form.subject} · {form.activity_type} ·{" "}
                {form.duration} min
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStatus("form");
                  setContent(null);
                }}
                className="text-sm border border-[#E0E0EC] px-3 py-2 rounded-xl text-[#6B6B8A] hover:border-[#E85D1E]/50 hover:text-[#E85D1E] transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm bg-[#E85D1E] text-white px-4 py-2 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "objectives",
                title: "🎯 Objectives",
                render: (c: ActivityContent) => (
                  <ul className="space-y-1.5">
                    {c.objectives.map((o, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-saffron">•</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                key: "sel_structure",
                title: "🧠 SEL Structure",
                render: (c: ActivityContent) => (
                  <div>
                    <p className="text-sm font-semibold text-heading mb-1">
                      {c.sel_structure.framework}
                    </p>
                    <p className="text-sm text-[#8a6848] mb-2">
                      {c.sel_structure.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.sel_structure.competencies.map((comp, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#f5ede0] text-saffron text-xs rounded-full"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: "real_world_connection",
                title: "🌍 Real-World Connection",
                render: (c: ActivityContent) => (
                  <p className="text-sm text-[#0F0F1A]">
                    {c.real_world_connection}
                  </p>
                ),
              },
              {
                key: "materials_needed",
                title: "📦 Materials Needed",
                render: (c: ActivityContent) => (
                  <div className="flex flex-wrap gap-2">
                    {c.materials_needed.map((m, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-card text-[#0F0F1A] text-xs rounded-full border border-border"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                key: "instructions",
                title: "📋 Instructions",
                render: (c: ActivityContent) => (
                  <ol className="space-y-3">
                    {c.instructions.map((inst, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="w-6 h-6 bg-saffron text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                          {inst.step}
                        </span>
                        <span className="text-[#0F0F1A]">
                          {inst.instruction}
                        </span>
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                key: "assessment",
                title: "✅ Assessment",
                render: (c: ActivityContent) => (
                  <div>
                    <p className="text-sm text-[#8a6848] mb-2">
                      {c.assessment.method}
                    </p>
                    <ul className="space-y-1.5">
                      {c.assessment.criteria.map((crit, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-teal">✓</span>
                          {crit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ].map(({ key, title, render }) => (
              <div
                key={key}
                className="bg-white border border-[#E0E0EC] rounded-2xl p-5"
              >
                <p className="font-jakarta font-semibold text-sm text-[#0F0F1A] mb-3">
                  {title}
                </p>
                {render(content)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
