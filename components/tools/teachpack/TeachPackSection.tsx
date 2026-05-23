"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useParams } from "next/navigation";

interface Props {
  title: string;
  children: React.ReactNode;
  onRegenerate?: () => void;
  regenerating?: boolean;
  className?: string;
  defaultCollapsed?: boolean;
}

export function TeachPackSection({
  title,
  children,
  onRegenerate,
  regenerating,
  className = "",
  defaultCollapsed = true,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const posthog = usePostHog();
  const params = useParams();

  function getSectionName(t: string) {
    if (t.includes("Lesson Overview")) return "Lesson Overview";
    if (t.includes("Teacher Explanation")) return "Teacher Explanation";
    if (t.includes("Classroom Questions")) return "Classroom Questions";
    if (t.includes("Activities")) return "Activities";
    if (t.includes("Homework")) return "Homework";
    if (t.includes("Exam Notes")) return "Exam Notes";
    if (t.includes("Recap")) return "Recap";
    return t.replace(/^[^\w\s]+/, "").trim();
  }

  function handleToggle() {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (!nextState) {
      posthog.capture("section_expanded", {
        section_name: getSectionName(title),
        teachpack_id: (params?.id as string) || "unsaved",
      });
    }
  }

  return (
    <div className={`section-card fade-in ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0EC]">
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 font-jakarta font-semibold text-teal text-sm flex-1 text-left hover:text-teal/80 transition-colors"
        >
          {collapsed ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 flex-shrink-0" />
          )}
          {title}
        </button>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            title="Regenerate this section"
            className="p-1.5 rounded-lg text-teal hover:text-teal/80 hover:bg-teal-50 transition-colors disabled:opacity-50 ml-2"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`}
            />
          </button>
        )}
      </div>
      {!collapsed && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

// Editable text field within a section
interface EditableFieldProps {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  className?: string;
}

export function EditableField({
  value,
  onChange,
  multiline,
  className = "",
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function save() {
    onChange(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className={`w-full border border-saffron rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 resize-none ${className}`}
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={`w-full border border-saffron rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 ${className}`}
          />
        )}
        <div className="flex gap-1 mt-1.5">
          <button
            onClick={save}
            className="flex items-center gap-1 text-xs font-medium text-saffron hover:text-saffron/80 px-2 py-1 rounded hover:bg-saffron-50 transition-colors"
          >
            <Check className="w-3 h-3" /> Save
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1 text-xs font-medium text-[#6B6B8A] hover:text-[#0F0F1A] px-2 py-1 rounded hover:bg-[#F5F5F7] transition-colors"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className={`text-sm text-[#0F0F1A] leading-relaxed ${className}`}>
        {value || "-"}
      </p>
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="absolute -right-1 -top-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-saffron hover:text-saffron/80 hover:bg-saffron-50"
        title="Edit"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
}
