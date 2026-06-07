import { createClient } from "@/lib/supabase/client";

export type RefusalRecord = {
  positionnement_id: number;
  annonce_id: number;
  diaspora_backend_id: number;
};

export async function syncPositionnementRefusalToCloud(
  entry: RefusalRecord,
): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  const { error } = await supabase.from("positionnement_refusals").upsert(
    {
      positionnement_id: entry.positionnement_id,
      annonce_id: entry.annonce_id,
      diaspora_backend_id: entry.diaspora_backend_id,
    },
    { onConflict: "positionnement_id" },
  );

  if (error) {
    console.warn("[positionnement-refusals] sync cloud:", error.message);
  }
}

export async function fetchRefusedPositionnementIdsForDiaspora(
  diasporaBackendId: number,
): Promise<Set<number>> {
  const supabase = createClient();
  if (!supabase) return new Set();

  const { data, error } = await supabase
    .from("positionnement_refusals")
    .select("positionnement_id")
    .eq("diaspora_backend_id", diasporaBackendId);

  if (error) {
    console.warn("[positionnement-refusals] fetch cloud:", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => Number(row.positionnement_id)));
}
