import { AddOn } from '@/types';


interface Props {
  addon: AddOn;
}

export function AddonRenderer({ addon }: Props) {
  const { type, content } = addon;

  if (type === 'analogies') {
    const data = content as { analogies?: string[] };
    if (!data.analogies || !Array.isArray(data.analogies)) return null;
    return (
      <ul className="space-y-2">
        {data.analogies.map((a, i) => (
          <li key={i} className="flex gap-2 text-sm text-[#0F0F1A]">
            <span className="text-yellow-500 flex-shrink-0 mt-0.5">💡</span>
            <span>{a}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (type === 'examples') {
    const data = content as { examples?: string[] };
    if (!data.examples || !Array.isArray(data.examples)) return null;
    return (
      <ul className="space-y-2">
        {data.examples.map((e, i) => (
          <li key={i} className="flex gap-2 text-sm text-[#0F0F1A]">
            <span className="flex-shrink-0 mt-0.5">🌍</span>
            <span>{e}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (type === 'assessment') {
    const data = content as { questions?: Array<{ id: string; type: string; question: string; answer: string }> };
    if (!data.questions || !Array.isArray(data.questions)) return null;
    return (
      <div className="space-y-4">
        {data.questions.map((q, i) => (
          <div key={i} className="p-4 bg-white border border-[#E0E0EC] rounded-xl">
            <div className="flex justify-between items-start gap-4 mb-2">
              <p className="text-sm font-semibold text-[#0F0F1A]">
                <span className="text-[#E85D1E] mr-2">Q{i + 1}.</span>
                {q.question}
              </p>
              <span className="text-[10px] uppercase font-bold text-[#6B6B8A] bg-[#F5F5F7] px-2 py-1 rounded-md tracking-wider">
                {q.type}
              </span>
            </div>
            <p className="text-sm text-[#0F0F1A] pl-7">
              <span className="font-semibold text-teal mr-2">Ans:</span>
              {q.answer}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'worksheet' || type === 'homework') {
    const data = content as { sections?: Array<{ type?: string; title?: string; questions: Array<{ question: string; options?: string[]; answer: string }> }> };
    if (!data.sections || !Array.isArray(data.sections)) return null;
    return (
      <div className="space-y-6">
        {data.sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h4 className="text-sm font-bold text-[#6B6B8A] uppercase tracking-wide mb-3">{section.title || section.type}</h4>
            <div className="space-y-3">
              {section.questions?.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-white border border-[#E0E0EC] rounded-xl">
                  <p className="text-sm font-semibold text-[#0F0F1A] mb-2">{qIdx + 1}. {q.question}</p>

                  {q.options && q.options.length > 0 && (
                    <ul className="pl-4 mb-3 space-y-1">
                      {q.options.map((opt, oIdx) => (
                        <li key={oIdx} className="text-sm text-[#0F0F1A] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E0E0EC]" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-2 pt-2 border-t border-dashed border-[#E0E0EC]">
                    <p className="text-sm text-[#0F0F1A]">
                      <span className="font-semibold text-teal mr-2">Ans:</span>
                      {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback if data format is completely unexpected
  return <pre className="text-xs text-[#6B6B8A] overflow-auto whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>;
}
