"use client";

import { useState } from "react";
import {
  FileText,
  ClipboardCheck,
  BookOpen,
  Lightbulb,
  Star,
  Loader2,
} from "lucide-react";

interface Props {
  topic: string;
  classLevel?: string;
  subject?: string;
  onAddonGenerated: (type: string, content: unknown) => void;
}

const ADDONS = [
  {
    type: "worksheet",
    label: "+ Add Worksheet",
    icon: FileText,
    desc: "MCQ, Fill blanks, Match, Short, Long answer",
  },
  {
    type: "assessment",
    label: "+ Add Assessment",
    icon: ClipboardCheck,
    desc: "5-question exit ticket",
  },
  {
    type: "homework",
    label: "+ Add Homework",
    icon: BookOpen,
    desc: "Take-home practice sheet",
  },
  {
    type: "analogies",
    label: "+ More Analogies",
    icon: Lightbulb,
    desc: "3 additional analogies",
  },
  {
    type: "examples",
    label: "+ More Examples",
    icon: Star,
    desc: "5 additional real-life examples",
  },
];

export function AddOnPanel({
  topic,
  classLevel,
  subject,
  onAddonGenerated,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function generateAddon(type: string) {
    setLoading(type);
    try {
      const res = await fetch("/api/generate/addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic, class: classLevel, subject }),
      });
      if (!res.ok) throw new Error("Failed");
      const { content } = await res.json();
      onAddonGenerated(type, content);
    } catch (err) {
      console.error("Addon error:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-[#6B6B8A] mb-3">
        Optional Add-ons
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ADDONS.map(({ type, label, icon: Icon, desc }) => (
          <button
            key={type}
            onClick={() => generateAddon(type)}
            disabled={!!loading}
            className="flex items-start gap-3 border-2 border-dashed border-[#E0E0EC] hover:border-[#F4C430] rounded-xl p-3 text-left transition-all hover:bg-[#f5ede0] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === type ? (
              <Loader2 className="w-5 h-5 text-[#E85D1E] animate-spin flex-shrink-0 mt-0.5" />
            ) : (
              <Icon className="w-5 h-5 text-[#E85D1E] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold text-[#E85D1E]">{label}</p>
              <p className="text-xs text-[#6B6B8A] mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
