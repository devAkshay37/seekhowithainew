"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GeneratingAnimation } from "@/components/shared/GeneratingAnimation";
import type {
  LastMinPrepContent,
  LastMinPrepFormInput,
  Profile,
} from "@/types";
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

const DEPTHS = [
  {
    value: "quick",
    label: "Quick Glance",
    desc: "1–2 min · Core Concept + Key Points + Analogy",
  },
  { value: "deep", label: "Deep Refresh", desc: "3–5 min · All sections" },
] as const;

interface Props {
  profile: Profile;
}

export default function NewLastMinPrepClient({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"form" | "generating" | "result">(
    "form",
  );
  const [content, setContent] = useState<LastMinPrepContent | null>(null);
  const [form, setForm] = useState<
    Omit<LastMinPrepFormInput, "depth"> & { depth: "quick" | "deep" }
  >({
    class: profile.classes?.[0] || "8",
    subject: profile.subjects?.[0] || "Science",
    topic: "",
    depth: "deep",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("generating");
    setError("");
    try {
      const res = await fetch("/api/generate/lastminprep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          language: profile.language_preference,
        }),
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
        .from("lastminpreps")
        .insert({
          user_id: user!.id,
          ...form,
          content,
          depth: form.depth,
        })
        .select()
        .single();
      if (data) router.push(`/app/lastminprep/${data.id}`);
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto pt-20 md:pt-0">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/app"
          className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            Last Min Prep
          </h1>
          <p className="text-sm text-[#6B6B8A]">Quick revision before class</p>
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
                  const newClass = value;
                  const isPrimary = ["1", "2", "3", "4", "5"].includes(
                    newClass,
                  );
                  const newSubject =
                    form.subject === "EVS" && !isPrimary
                      ? "Science"
                      : form.subject;

                  setForm({ ...form, class: newClass, subject: newSubject });
                }}
              >
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
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
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
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
              placeholder="e.g. Photosynthesis, Fractions..."
              className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]"
              onSelectTopic={(topic) => setForm({ ...form, topic })}
            />
            <div className="mb-5" />
            <label className="block text-sm font-medium text-[#0F0F1A] mb-2">
              Depth
            </label>
            <div className="space-y-2">
              {DEPTHS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, depth: value })}
                  className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 rounded-xl border border-border text-left transition-colors ${form.depth === value ? "bg-saffron text-white border-saffron" : "bg-card text-foreground hover:border-teal"}`}
                >
                  <span
                    className={`font-medium text-sm ${form.depth === value ? "text-inherit" : "text-[#0F0F1A]"}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-xs mt-1 sm:mt-0 ${form.depth === value ? "text-white/80" : "text-[#6B6B8A]"}`}
                  >
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!form.topic.trim()}
            className="w-full bg-[#E85D1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
          >
            ⚡ Generate Prep Card
          </button>
        </form>
      )}
      {status === "generating" && (
        <GeneratingAnimation
          labels={[
            "Summarising topic…",
            "Finding key points…",
            "Selecting best analogy…",
            "Writing teacher notes…",
          ]}
        />
      )}
      {status === "result" && content && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-jakarta font-bold text-[#0F0F1A]">
              {form.topic}
            </h2>
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

          <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6 space-y-5">
            {/* Core Concept */}
            <div>
              <p className="text-xs font-semibold text-[#E85D1E] uppercase tracking-wide mb-2">
                Core Concept
              </p>
              <p className="text-sm text-[#0F0F1A] leading-relaxed">
                {content.core_concept}
              </p>
            </div>
            {/* Key Points */}
            {content.key_points?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
                  Key Points
                </p>
                <ul className="space-y-1.5">
                  {content.key_points.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-[#E85D1E] font-bold">•</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Must Know Terms */}
            {form.depth === "deep" && content.must_know_terms?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
                  Must-Know Terms
                </p>
                <div className="space-y-2">
                  {content.must_know_terms.map((item, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="font-semibold text-[#0F0F1A] flex-shrink-0">
                        {item.term}:
                      </span>
                      <span className="text-[#6B6B8A]">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Common Confusions */}
            {form.depth === "deep" && content.common_confusions?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
                  Common Student Confusions
                </p>
                <ul className="space-y-1.5">
                  {content.common_confusions.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-yellow-500">⚠</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Best Analogy */}
            <div className="bg-[#f5ede0] border border-saffron/30 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#E85D1E] uppercase tracking-wide mb-1.5">
                Best Analogy
              </p>
              <p className="text-sm text-[#0F0F1A]">{content.best_analogy}</p>
            </div>
            {/* Quick Questions */}
            {form.depth === "deep" && content.quick_questions?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
                  Quick Questions to Ask Class
                </p>
                <ul className="space-y-1.5">
                  {content.quick_questions.map((q, i) => (
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
            {/* Teacher Notes */}
            {content.teacher_notes && (
              <div className="border-t border-[#E0E0EC] pt-4">
                <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
                  Teacher Notes
                </p>
                <p
                  className={`text-sm text-[#0F0F1A] leading-relaxed ${["Hindi", "Marathi"].includes(profile.language_preference) ? "font-devanagari" : profile.language_preference === "Gujarati" ? "font-gujarati" : ""}`}
                >
                  {content.teacher_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
