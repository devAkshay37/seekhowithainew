"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TeachPackView } from "./TeachPackView";
import type {
  TeachPack,
  TeachPackContent,
  AddOn,
  TeachPackFormInput,
} from "@/types";
import { usePostHog } from "posthog-js/react";

interface Props {
  pack: TeachPack;
  formData: TeachPackFormInput;
}

export function TeachPackDetailClient({ pack, formData }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const posthog = usePostHog();

  async function handleUpdate(finalContent: TeachPackContent, addons: AddOn[]) {
    setSaving(true);
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("teachpacks")
        .update({
          content: finalContent,
          addons: addons,
        })
        .eq("id", pack.id);

      if (updateError) throw updateError;

      posthog.capture("teachpack_updated", {
        teachpack_id: pack.id,
        tool: "TeachPack",
      });

      router.push("/app");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error updating TeachPack:", err);
      setError(err instanceof Error ? err.message : "Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleRegenerate() {
    // Redirect to the dashboard where the form is permanently available
    router.push("/app");
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      <TeachPackView
        content={pack.content}
        formData={formData}
        savedId={pack.id}
        onSave={handleUpdate}
        saving={saving}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
