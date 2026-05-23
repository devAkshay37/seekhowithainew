"use client";

import { useState } from "react";
import type { TeachPackFormInput, Profile } from "@/types";
import { usePostHog } from "posthog-js/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TopicSuggestions } from "@/components/tools/shared/TopicSuggestions";

interface Props {
  profile: Profile;
  onSubmit: (data: TeachPackFormInput) => void;
  loading: boolean;
}

const DURATIONS = [30, 45, 60] as const;
const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati"] as const;

const ChevronIcon = () => (
  <svg
    className="w-4 h-4 text-[#0F0F1A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const getOrdinal = (n: string) => {
  const num = parseInt(n);
  if (num === 1) return "1st";
  if (num === 2) return "2nd";
  if (num === 3) return "3rd";
  return `${n}th`;
};

export function TeachPackForm({ profile, onSubmit, loading }: Props) {
  const posthog = usePostHog();
  const [form, setForm] = useState<TeachPackFormInput>({
    board: profile.board || "CBSE",
    class: profile.classes?.[0] || "8",
    subject: profile.subjects?.[0] || "Science",
    topic: "",
    number_of_lectures: 1,
    duration: 45,
    language:
      (profile.language_preference as TeachPackFormInput["language"]) ||
      "English",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.topic.trim()) return;
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto font-sans flex flex-col items-center"
    >
      <div className="w-full relative pt-10 md:pt-0">
        {/* Top Tab */}
        <div className="flex flex-col border border-[#E0E0EC] border-b-0 rounded-t-[1.25rem] bg-white w-full px-3 py-2 relative z-10 mb-[-1px]">
          {/* Top Left Label */}
          <div className="text-sm mb-1 px-3 pt-1 font-jakarta font-bold text-[#0F0F1A] text-[16px]">
            Teachpack form
          </div>

          {/* Select Row */}
          <div className="flex flex-wrap items-center gap-y-1">
            <Select
              value={form.board}
              onValueChange={(value) => {
                setForm({ ...form, board: value });
                posthog.capture("board_selected", { board: value });
              }}
            >
              <SelectTrigger className="border-0 ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 bg-transparent text-sm outline-none cursor-pointer px-3 py-1 font-medium text-[#0F0F1A] w-full max-w-36">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                className="w-[var(--radix-select-trigger-width)]"
              >
                {["CBSE", "ICSE", "State Board"].map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-3.5 bg-[#D6D6E5] mx-1 hidden sm:block"></div>

            <Select
              value={String(form.duration)}
              onValueChange={(value) =>
                setForm({ ...form, duration: parseInt(value) as TeachPackFormInput['duration'] })
              }
            >
              <SelectTrigger className="border-0 ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 bg-transparent text-sm outline-none cursor-pointer px-3 py-1 font-medium text-[#0F0F1A] w-full max-w-36">
                <SelectValue>
                  {form.duration
                    ? `${form.duration} mins Lecture`
                    : "Select duration"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent
                position="popper"
                className="w-[var(--radix-select-trigger-width)]"
              >
                {DURATIONS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-3.5 bg-[#D6D6E5] mx-1 hidden sm:block"></div>

            <Select
              value={form.language}
              onValueChange={(value) => {
                const lang = value as TeachPackFormInput["language"];
                setForm({ ...form, language: lang });
                posthog.capture("language_selected", { language: lang });
              }}
            >
              <SelectTrigger className="border-0 ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 bg-transparent text-sm outline-none cursor-pointer px-3 py-1 font-medium text-[#0F0F1A] w-full max-w-36">
                {form.language
                  ? `Notes in ${form.language}`
                  : "Select language"}
              </SelectTrigger>

              <SelectContent
                position="popper"
                className="w-[var(--radix-select-trigger-width)]"
              >
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Box */}
        <div className="border border-[#E0E0EC] bg-white rounded-b-[1.25rem] shadow-md transition-all flex flex-col pt-1 pb-3 px-3">
          <TopicSuggestions
            board={"NCERT"}
            classNum={form.class}
            subject={form.subject}
            value={form.topic}
            onSelectTopic={(topic) => setForm({ ...form, topic })}
          />

          {/* Pills Row */}
          <div className="flex flex-wrap items-center gap-2.5 px-2">
            {/* Class */}
            <div className="relative">
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

                  posthog.capture("class_selected", { class: newClass });
                }}
              >
                <SelectTrigger className="appearance-none border border-[#E0E0EC] rounded-full pl-5 pr-5 py-2.5 text-sm bg-white outline-none cursor-pointer transition-all">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {getOrdinal(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <ChevronIcon /> */}
            </div>

            {/* Subject */}
            <div className="relative">
              <Select
                value={form.subject}
                onValueChange={(value) => {
                  const subject = value;

                  setForm({ ...form, subject });

                  posthog.capture("subject_selected", { subject });
                }}
              >
                <SelectTrigger className="appearance-none border border-[#E0E0EC] rounded-full pl-5 pr-5 py-2.5 text-sm bg-white outline-none cursor-pointer transition-all">
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
              {/* <ChevronIcon /> */}
            </div>

            {/* Lectures */}
            <div className="relative">
              <Select
                value={String(form.number_of_lectures)}
                onValueChange={(value) => {
                  setForm({
                    ...form,
                    number_of_lectures: parseInt(value),
                  });

                  posthog.capture("number_of_lectures_selected", {
                    number_of_lectures: parseInt(value),
                  });
                }}
              >
                <SelectTrigger className="appearance-none border border-[#E0E0EC] rounded-full pl-5 pr-5 py-2.5 text-sm bg-white outline-none cursor-pointer transition-all">
                  <SelectValue placeholder="Select lectures" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} Lecture{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <ChevronIcon /> */}
            </div>

            {/* Submit */}
            <button
              id="generate-teachpack"
              type="submit"
              disabled={!form.topic.trim() || loading}
              className="w-full sm:w-auto sm:ml-auto bg-[#E85D1E] text-white font-semibold py-2.5 px-6 rounded-full hover:bg-[#d05018] active:scale-[0.98] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Generating…" : "✨ Generate TeachPack"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
