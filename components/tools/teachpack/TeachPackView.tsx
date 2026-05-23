"use client";

import { useState } from "react";
import { Save, BookOpen } from "lucide-react";
import { TeachPackSection, EditableField } from "./TeachPackSection";
import { AddOnPanel } from "./AddOnPanel";
import { AddonRenderer } from "./AddonRenderer";
import { usePostHog } from "posthog-js/react";
import type {
  TeachPackContent,
  TeachPackFormInput,
  AddOn,
  TeachPackLecture,
} from "@/types";

interface Props {
  content: TeachPackContent;
  formData: TeachPackFormInput;
  savedId?: string;
  onSave?: (content: TeachPackContent, addons: AddOn[]) => void;
  saving?: boolean;
  onRegenerate?: () => void;
}

export function TeachPackView({
  content: initialContent,
  formData,
  savedId,
  onSave,
  saving,
  onRegenerate,
}: Props) {
  const [content, setContent] = useState<TeachPackContent>(initialContent);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [activeLecture, setActiveLecture] = useState(0);
  const posthog = usePostHog();


  function updateContent(path: (string | number)[], value: unknown) {
    if (savedId) {
      posthog.capture("teachpack_edited", {
        teachpack_id: savedId,
        tool: "TeachPack",
      });
    }
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: Record<string, any> = next;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  function handleAddonGenerated(type: string, addonContent: unknown) {
    setAddons((prev) => {
      const existing = prev.findIndex(
        (a) => a.type === (type as AddOn["type"]),
      );
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = {
          type: type as AddOn["type"],
          content: addonContent as Record<string, unknown>,
        };
        return next;
      }
      return [
        ...prev,
        {
          type: type as AddOn["type"],
          content: addonContent as Record<string, unknown>,
        },
      ];
    });
  }

  const langClass = ["Hindi", "Marathi"].includes(formData.language)
    ? "font-devanagari"
    : formData.language === "Gujarati"
      ? "font-gujarati"
      : "";

  const lectures = content.lectures || [];
  const lecture: TeachPackLecture | undefined = lectures[activeLecture];

  if (!lecture) return null;

  return (
    <div className={`space-y-4 ${lectures.length > 1 ? "pb-20 md:pb-0" : ""}`}>
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-jakarta text-lg font-bold text-[#0F0F1A]">{formData.topic}</h2>
          <p className="text-sm text-[#6B6B8A]">
            Class {formData.class} · {formData.subject} · {formData.board} ·{" "}
            {lectures.length} Lecture(s) · {formData.duration} min each
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="text-sm border border-[#E0E0EC] px-3 py-2 rounded-xl text-[#6B6B8A] hover:border-[#E85D1E]/50 hover:text-[#E85D1E] transition-colors"
            >
              Regenerate
            </button>
          )}
          {onSave && (
            <button
              id="save-teachpack"
              onClick={() => onSave(content, addons)}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm bg-[#E85D1E] text-white px-4 py-2 rounded-xl hover:bg-[#d05018] transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />{saving ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Desktop */}
      {lectures.length > 1 && (
        <div className="hidden md:flex bg-white rounded-xl p-1.5 border border-[#E0E0EC] overflow-x-auto hide-scrollbar gap-1 shadow-sm">
          {lectures.map((l, i) => (
            <button
              key={i}
              onClick={() => setActiveLecture(i)}
              className={`flex-1 min-w-[100px] py-2.5 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap text-left ${activeLecture === i
                ? "bg-[#f5ede0] text-saffron border border-saffron/50 shadow-sm"
                : "text-[#6B6B8A] hover:text-[#0F0F1A] hover:bg-[#F5F5F7] border border-transparent"
                }`}
            >
              <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                Lecture {l.lecture_number}
              </div>
              <div className="truncate">{l.lecture_title}</div>
            </button>
          ))}
        </div>
      )}

      {/* Section 1: Learning Objectives */}
      <TeachPackSection title="🎯 Learning Objectives" defaultCollapsed={false}>
        <ol className="space-y-2">
          {lecture.learning_objectives.map((obj, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-[#0F0F1A]"
            >
              <span className="w-5 h-5 bg-saffron text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              <EditableField
                value={obj}
                onChange={(v) => {
                  const objs = [...lecture.learning_objectives];
                  objs[i] = v;
                  updateContent(
                    ["lectures", activeLecture, "learning_objectives"],
                    objs,
                  );
                }}
              />
            </li>
          ))}
        </ol>
      </TeachPackSection>

      {/* Section 2: Lesson Overview */}
      <TeachPackSection title="📋 Lesson Overview">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Concept Summary
            </p>
            <EditableField
              value={lecture.lesson_overview.concept_summary}
              onChange={(v) =>
                updateContent(
                  [
                    "lectures",
                    activeLecture,
                    "lesson_overview",
                    "concept_summary",
                  ],
                  v,
                )
              }
              multiline
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Learning Goals
            </p>
            <ul className="space-y-1.5">
              {lecture.lesson_overview.learning_goals.map((goal, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#0F0F1A]"
                >
                  <span className="text-saffron font-bold flex-shrink-0 mt-0.5">
                    •
                  </span>
                  <EditableField
                    value={goal}
                    onChange={(v) => {
                      const goals = [...lecture.lesson_overview.learning_goals];
                      goals[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "lesson_overview",
                          "learning_goals",
                        ],
                        goals,
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Key Ideas
            </p>
            <div className="flex flex-wrap gap-2">
              {lecture.lesson_overview.key_ideas.map((idea, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-card text-heading text-sm font-semibold rounded-[20px] border border-border"
                >
                  <EditableField
                    value={idea}
                    onChange={(v) => {
                      const ideas = [...lecture.lesson_overview.key_ideas];
                      ideas[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "lesson_overview",
                          "key_ideas",
                        ],
                        ideas,
                      );
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </TeachPackSection>

      {/* Section 3: Teaching Flow */}
      <TeachPackSection title="🗺️ Teaching Flow">
        <div className="space-y-3">
          {lecture.teaching_flow.map((step, i) => (
            <div key={i} className="flex gap-4 p-3 bg-[#F5F5F7] rounded-xl">
              <div className="flex-shrink-0 text-center">
                <div className="w-8 h-8 brand-gradient text-white text-xs font-bold rounded-xl flex items-center justify-center">
                  {step.step}
                </div>
                <p className="text-[10px] text-[#6B6B8A] mt-1 font-medium">
                  {step.duration}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-saffron uppercase tracking-wide mb-1">
                  {step.phase}
                </p>
                <EditableField
                  value={step.description}
                  onChange={(v) => {
                    const flow = [...lecture.teaching_flow];
                    flow[i] = { ...flow[i], description: v };
                    updateContent(
                      ["lectures", activeLecture, "teaching_flow"],
                      flow,
                    );
                  }}
                  multiline
                />
              </div>
            </div>
          ))}
        </div>
      </TeachPackSection>

      {/* Section 4: Teacher Explanation */}
      <TeachPackSection title="💡 Teacher Explanation">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Concept Breakdown
            </p>
            <EditableField
              value={lecture.teacher_explanation.concept_breakdown}
              onChange={(v) =>
                updateContent(
                  [
                    "lectures",
                    activeLecture,
                    "teacher_explanation",
                    "concept_breakdown",
                  ],
                  v,
                )
              }
              multiline
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Analogies
            </p>
            <ul className="space-y-2">
              {lecture.teacher_explanation.analogies.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-yellow-500 flex-shrink-0">💡</span>
                  <EditableField
                    value={a}
                    onChange={(v) => {
                      const arr = [...lecture.teacher_explanation.analogies];
                      arr[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "teacher_explanation",
                          "analogies",
                        ],
                        arr,
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Real-Life Examples
            </p>
            <ul className="space-y-2">
              {lecture.teacher_explanation.real_life_examples.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="flex-shrink-0">🌍</span>
                  <EditableField
                    value={e}
                    onChange={(v) => {
                      const arr = [
                        ...lecture.teacher_explanation.real_life_examples,
                      ];
                      arr[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "teacher_explanation",
                          "real_life_examples",
                        ],
                        arr,
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2">
              Teaching Tips
            </p>
            <ul className="space-y-2">
              {lecture.teacher_explanation.teaching_tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="flex-shrink-0">✅</span>
                  <EditableField
                    value={tip}
                    onChange={(v) => {
                      const arr = [...lecture.teacher_explanation.teaching_tips];
                      arr[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "teacher_explanation",
                          "teaching_tips",
                        ],
                        arr,
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TeachPackSection>

      {/* Section 5: Classroom Questions */}
      <TeachPackSection title="❓ Classroom Questions">
        {(
          [
            "recall",
            "understanding",
            "application",
            "critical_thinking",
          ] as const
        ).map((type) => (
          <div key={type} className="mb-5">
            <p className="text-xs font-semibold text-[#6B6B8A] uppercase tracking-wide mb-2 capitalize">
              {type.replace("_", " ")}
            </p>
            <ul className="space-y-1.5">
              {lecture.classroom_questions[type].map((q, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-saffron font-bold flex-shrink-0">
                    Q{i + 1}.
                  </span>
                  <EditableField
                    value={q}
                    onChange={(v) => {
                      const arr = [...lecture.classroom_questions[type]];
                      arr[i] = v;
                      updateContent(
                        [
                          "lectures",
                          activeLecture,
                          "classroom_questions",
                          type,
                        ],
                        arr,
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </TeachPackSection>
      {/* Section 6: Teacher Notes */}
      <TeachPackSection
        title={`📝 Teacher Notes (${formData.language})`}
        className="border-border bg-background"
      >
        <div className={`text-sm text-[#0F0F1A] leading-relaxed ${langClass}`}>
          <EditableField
            value={lecture.teacher_notes}
            onChange={(v) =>
              updateContent(["lectures", activeLecture, "teacher_notes"], v)
            }
            multiline
          />
        </div>
      </TeachPackSection>
      {/* Generated Add-on Sections */}
      {addons.map((addon, i) => (
        <TeachPackSection
          key={i}
          title={`📎 ${addon.type.charAt(0).toUpperCase() + addon.type.slice(1)}`}
        >
          <AddonRenderer addon={addon} />
        </TeachPackSection>
      ))}
      {/* Add-ons Configuration */}
      <AddOnPanel
        topic={formData.topic}
        classLevel={formData.class}
        subject={formData.subject}
        onAddonGenerated={handleAddonGenerated}
      />
      {/* Mobile Bottom Navigation for Lectures */}
      {lectures.length > 1 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E0EC] safe-area-pb">
          <div className="flex items-stretch h-16">
            {lectures.map((l, i) => (
              <button
                key={i}
                onClick={() => setActiveLecture(i)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${activeLecture === i ? "text-[#E85D1E]" : "text-[#6B6B8A]"
                  }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-medium">Lecture {l.lecture_number}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
