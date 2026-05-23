"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GeneratingAnimation } from "@/components/shared/GeneratingAnimation";
import type { QuizContent, Profile } from "@/types";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicSuggestions } from "@/components/tools/shared/TopicSuggestions";

const QUESTION_TYPES = [
  "MCQ",
  "Fill in the Blanks",
  "Match the Following",
  "Short Answer",
  "Long Answer",
];
const DIFFICULTIES = ["easy", "medium", "hard", "mixed"] as const;
const DURATIONS = [30, 45, 60, 90] as const;

interface Props {
  profile: Profile;
}

export default function NewQuizClient({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"form" | "generating" | "result">(
    "form",
  );
  const [content, setContent] = useState<QuizContent | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [form, setForm] = useState({
    class: profile.classes?.[0] || "8",
    subject: profile.subjects?.[0] || "Science",
    topics: "",
    total_marks: 25,
    duration: 45 as 30 | 45 | 60 | 90,
    difficulty: "mixed" as "easy" | "medium" | "hard" | "mixed",
    question_types: ["MCQ", "Short Answer"],
    include_answer_key: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleQType(type: string) {
    setForm((prev) => ({
      ...prev,
      question_types: prev.question_types.includes(type)
        ? prev.question_types.filter((t) => t !== type)
        : [...prev.question_types, type],
    }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("generating");
    setError("");
    try {
      const res = await fetch("/api/generate/quiz", {
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
        .from("quizzes")
        .insert({
          user_id: user!.id,
          class: form.class,
          subject: form.subject,
          topics: form.topics.split(",").map((t) => t.trim()),
          total_marks: form.total_marks,
          duration: form.duration,
          difficulty: form.difficulty,
          question_types: form.question_types,
          include_answer_key: form.include_answer_key,
          content,
          is_starred: false,
        })
        .select()
        .single();
      if (data) router.push(`/app/quiz/${data.id}`);
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto pt-20 md:pt-0">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/app"
          className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">
            Quiz / Test Paper
          </h1>
          <p className="text-sm text-[#6B6B8A]">
            Generate printable test papers with answer keys
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
              Topic(s) <span className="text-[#E85D1E]">*</span>
            </label>
            <TopicSuggestions
              board={"NCERT"}
              classNum={form.class}
              subject={form.subject}
              value={form.topics}
              placeholder="e.g. Photosynthesis, Cell Division (comma separated)"
              className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]"
              onChangeTopic={(topic) => {
                setForm({ ...form, topics: topic });
              }}
              onSelectTopic={(topic) => {
                const parts = form.topics.split(",");
                if (parts.length > 0) {
                  parts[parts.length - 1] = topic;
                } else {
                  parts.push(topic);
                }
                const newTopics = parts
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .join(", ");
                setForm({ ...form, topics: newTopics });
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
                Total Marks
              </label>
              <input
                type="number"
                min={5}
                max={100}
                value={form.total_marks}
                onChange={(e) =>
                  setForm({ ...form, total_marks: Number(e.target.value) })
                }
                className="w-full border border-[#E0E0EC] rounded-xl px-4 py-[7px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
                Duration
              </label>

              <Select
                value={String(form.duration)}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    duration: Number(value) as typeof form.duration,
                  })
                }
              >
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
                Difficulty
              </label>

              <Select
                value={form.difficulty}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    difficulty: value as typeof form.difficulty,
                  })
                }
              >
                <SelectTrigger className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>

                <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]"                >
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      <span className="capitalize">{d}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-2">
              Question Types
            </label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleQType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.question_types.includes(t) ? "bg-[#E85D1E] text-white border-[#E85D1E]" : "border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  include_answer_key: !form.include_answer_key,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors ${form.include_answer_key ? "bg-[#E85D1E]" : "bg-[#E0E0EC]"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.include_answer_key ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
            <span className="text-sm text-[#0F0F1A]">Include Answer Key</span>
          </div>
          <button
            type="submit"
            disabled={!form.topics.trim() || form.question_types.length === 0}
            className="w-full bg-[#E85D1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
          >
            📄 Generate Test Paper
          </button>
        </form>
      )}
      {status === "generating" && (
        <GeneratingAnimation
          labels={[
            "Distributing marks…",
            "Creating MCQs…",
            "Writing short answers…",
            "Building answer key…",
          ]}
        />
      )}
      {status === "result" && content && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-jakarta font-bold text-[#0F0F1A]">
                {content.paper_header.title}
              </h2>
              <p className="text-sm text-[#6B6B8A]">
                Class {content.paper_header.class} ·{" "}
                {content.paper_header.duration} ·{" "}
                {content.paper_header.total_marks} marks
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
                <RefreshCw className="w-3.5 h-3.5" />
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

          {/* Tab: Test Paper / Answer Key */}
          {form.include_answer_key && (
            <div className="flex gap-1 bg-[#F5F5F7] p-1 rounded-xl w-fit">
              {["Test Paper", "Answer Key"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShowAnswerKey(tab === "Answer Key")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(showAnswerKey ? tab === "Answer Key" : tab === "Test Paper") ? "bg-white text-[#0F0F1A] shadow-sm" : "text-[#6B6B8A] hover:text-[#0F0F1A]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* A4 preview */}
          <div className="bg-white border border-[#E0E0EC] rounded-2xl p-8 font-serif">
            <div className="text-center mb-6 border-b border-gray-300 pb-4">
              <h2 className="text-xl font-bold">
                {content.paper_header.title}
              </h2>
              <div className="flex justify-between text-sm mt-2 text-gray-600">
                <span>Class: {content.paper_header.class}</span>
                <span>Subject: {form.subject}</span>
                <span>Duration: {content.paper_header.duration}</span>
                <span>Max Marks: {content.paper_header.total_marks}</span>
              </div>
            </div>

            {content.sections.map((section, si) => (
              <div key={si} className="mb-6">
                <h3 className="font-bold text-sm mb-3 uppercase tracking-wide">
                  Section {String.fromCharCode(65 + si)}: {section.type} (
                  {section.marks_per_question} mark
                  {section.marks_per_question > 1 ? "s" : ""} each)
                </h3>
                <ol className="space-y-4">
                  {section.questions.map((q, qi) => (
                    <li key={q.id} className="text-sm">
                      <p className="font-medium mb-1">
                        {qi + 1}. {q.question}
                      </p>
                      {q.options && q.options.length > 0 && (
                        <ol className="grid grid-cols-2 gap-1 ml-4" type="a">
                          {q.options.map((opt, oi) => (
                            <li key={oi} className="text-gray-700">
                              {String.fromCharCode(97 + oi)}) {opt}
                            </li>
                          ))}
                        </ol>
                      )}
                      {showAnswerKey && (
                        <p className="mt-1 text-teal font-medium text-xs">
                          Answer: {q.answer}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
