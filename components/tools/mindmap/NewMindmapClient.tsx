"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MindmapCanvas } from "@/components/tools/mindmap/MindmapCanvas";
import { GeneratingAnimation } from "@/components/shared/GeneratingAnimation";
import type { MindmapContent, Profile } from "@/types";
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

const DEPTHS = ["broad", "standard", "detailed"] as const;

interface Props {
  profile: Profile;
}

export default function NewMindmapClient({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"form" | "generating" | "result">(
    "form",
  );
  const [content, setContent] = useState<MindmapContent | null>(null);
  const [form, setForm] = useState({
    class: profile.classes?.[0] || "8",
    subject: profile.subjects?.[0] || "Science",
    topic: "",
    depth: "standard" as "broad" | "standard" | "detailed",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("generating");
    setError("");
    try {
      const res = await fetch("/api/generate/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        .from("mindmaps")
        .insert({ user_id: user!.id, ...form, content, is_starred: false })
        .select()
        .single();
      if (data) router.push(`/app/mindmap/${data.id}`);
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto pt-20 md:pt-0">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            Mindmap Creator
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Interactive visual concept map
          </p>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {status === "form" && (
        <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-[#E0E0EC] p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Class</label>
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

                <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
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

                <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
                  {(["1", "2", "3", "4", "5"].includes(form.class)
                    ? ["Maths", "EVS", "Science", "Hindi Vyakran", "English Grammar", "Computer", "SST", "Other",]
                    : ["Maths", "Science", "Hindi Vyakran", "English Grammar", "Computer", "SST", "Other",]
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
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">  Topic * </label>
            <TopicSuggestions
              board={"NCERT"}
              classNum={form.class}
              subject={form.subject}
              value={form.topic}
              placeholder="e.g. Photosynthesis"
              className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]"
              onSelectTopic={(topic) => setForm({ ...form, topic })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-2">Depth </label>
            <div className="flex flex-col sm:flex-row gap-2">
              {DEPTHS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, depth: d })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors capitalize ${form.depth === d ? "bg-[#E85D1E] text-white border-[#E85D1E]" : "border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!form.topic.trim()}
            className="w-full bg-[#E85D1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
          >
            🧠 Generate Mindmap
          </button>
        </form>
      )}
      {status === "generating" && (
        <GeneratingAnimation
          labels={[
            "Analysing concept…",
            "Mapping branches…",
            "Adding sub-concepts…",
            "Assigning colors…",
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
          <MindmapCanvas content={content} onContentChange={setContent} />
        </div>
      )}
    </div>
  );
}
