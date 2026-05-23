"use client";

import { useState } from "react";
import type { Quiz } from "@/types";
import { Printer } from "lucide-react";

interface Props {
  quiz: Quiz;
}

export function QuizDetailClient({ quiz }: Props) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div className="flex gap-2">
          {quiz.include_answer_key && (
            <div className="flex gap-1 bg-[#F5F5F7] p-1 rounded-xl w-fit">
              {["Test Paper", "Answer Key"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShowAnswerKey(tab === "Answer Key")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(showAnswerKey ? tab === "Answer Key" : tab === "Test Paper")
                    ? "bg-white text-[#0F0F1A] shadow-sm"
                    : "text-[#6B6B8A] hover:text-[#0F0F1A]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-sm border border-[#E0E0EC] px-4 py-2 rounded-xl text-[#6B6B8A] hover:border-[#E85D1E]/50 hover:text-[#E85D1E] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* A4 preview */}
      <div id="quiz-print-area" className="bg-white border border-[#E0E0EC] rounded-2xl p-4 sm:p-8 font-serif shadow-sm">
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#0F0F1A]">
            {showAnswerKey ? "Answer Key" : quiz.content.paper_header.title}
          </h2>
          <div className="grid grid-cols-2 sm:flex sm:justify-between text-sm mt-3 text-gray-600 gap-1 font-sans font-medium">
            <span>Class: {quiz.content.paper_header.class}</span>
            <span>Subject: {quiz.subject}</span>
            <span>Duration: {quiz.content.paper_header.duration}</span>
            <span>Max Marks: {quiz.content.paper_header.total_marks}</span>
          </div>
        </div>

        {quiz.content.sections.map((section, si) => (
          <div key={si} className="mb-6 last:mb-0">
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wide border-l-4 border-[#E85D1E] pl-2 py-0.5">
              Section {String.fromCharCode(65 + si)}: {section.type} ({section.marks_per_question} mark{section.marks_per_question > 1 ? 's' : ''} each)
            </h3>
            <ol className="space-y-6">
              {section.questions.map((q, qi) => (
                <li key={q.id} className="text-[15px] leading-relaxed text-[#0F0F1A]">
                  <div className="flex gap-2">
                    <span className="font-bold">{qi + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-1 mt-3">
                          {q.options.map((opt, oi) => (
                            <p key={oi} className="text-gray-700 flex items-start gap-2">
                              <span className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-full text-xs font-bold shrink-0 mt-0.5">
                                {String.fromCharCode(97 + oi)}
                              </span>
                              <span>{opt}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {showAnswerKey && (
                        <div className="mt-3 bg-teal-50/30 border border-teal-100/50 p-2 rounded-lg">
                          <p className="text-[#0D9488] font-bold text-sm flex items-center gap-1.5">
                            <span className="bg-[#0D9488] text-white text-[10px] px-1.5 py-0.5 rounded">ANSWER</span>
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {/* School Footer (Optional) */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400 font-sans italic">
          Generated via SeekhoWithAI
        </div>
      </div>
    </div>
  );
}
