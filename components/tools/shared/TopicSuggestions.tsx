"use client";

import { useState, useEffect } from "react";
import { getTopicSuggestions } from "@/lib/db/topic-suggestions";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

interface Props {
  board: string;
  classNum: string;
  subject: string;
  value: string;
  onSelectTopic: (topic: string) => void;
  onChangeTopic?: (topic: string) => void;
  placeholder?: string;
  className?: string;
}

export function TopicSuggestions({
  board,
  classNum,
  subject,
  value,
  onSelectTopic,
  onChangeTopic,
  placeholder = "Chapter/Topic",
  className
}: Props) {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      if (!board || !classNum || !subject) {
        setTopics([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getTopicSuggestions(board, classNum, subject);
        setTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, [board, classNum, subject]);

  return (
    <Combobox
      items={topics}
      value={value}
      onSelect={(val) => { if (typeof val === "string") onSelectTopic(val); }}
      onChange={onChangeTopic}
    >
      <ComboboxInput placeholder={placeholder} className={className} />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} value={String(item)}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
        {loading && (
          <div className="px-4 py-2 text-xs text-gray-400 italic">
            Loading suggestions...
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
