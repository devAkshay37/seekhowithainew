import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getTopicSuggestions(board: string, classNum: string, subject: string) {
  try {
    const { data, error } = await supabase
      .from("topic_suggestions")
      .select("topic")
      .eq("board", board)
      .eq("class", classNum)
      .eq("subject", subject)
      .order("topic", { ascending: true });

    if (error) {
      console.error("Error fetching topic suggestions:", error);
      return [];
    }

    return data.map((item) => item.topic);
  } catch (err) {
    console.error("Unexpected error fetching topic suggestions:", err);
    return [];
  }
}
