import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to all INSERT/UPDATE/DELETE on a public table and invalidate
 * the given React Query keys so UI updates instantly without a reload.
 */
export function useRealtime(table: string, queryKeys: ReadonlyArray<ReadonlyArray<unknown>>) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`rt:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        for (const key of queryKeys) qc.invalidateQueries({ queryKey: key as unknown[] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);
}
