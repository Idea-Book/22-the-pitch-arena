import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MEDIA_BUCKET, mediaProxyUrl, resolveMediaUrl } from "@/lib/media";
import { Field, inputCls } from "@/components/admin/admin-shell";

type Props = {
  label: string;
  /** Storage sub-folder, e.g. "episodes". */
  folder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

/** URL field + direct upload into the media bucket, with live preview. */
export function ImageInput({ label, folder, value, onChange, error }: Props) {
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const preview = resolveMediaUrl(value);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    if (file.size > 10 * 1024 * 1024) return toast.error("Image must be under 10 MB");
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      setBroken(false);
      onChange(mediaProxyUrl(path));
      toast.success("Image uploaded");
    } catch (e: any) {
      console.error("[media] upload failed", e);
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Field label={label} error={error} hint="Paste a URL or upload — both resolve through the media pipeline.">
      <div className="flex gap-3">
        <div className="size-16 shrink-0 bg-[var(--surface)] ring-1 ring-border overflow-hidden grid place-items-center">
          {preview && !broken ? (
            <img src={preview} alt="" className="size-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground text-center px-1">
              {broken ? "Broken" : "No img"}
            </span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className={inputCls}
            value={value ?? ""}
            placeholder="https://… or upload"
            onChange={(e) => { setBroken(false); onChange(e.target.value); }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { setBroken(false); onChange(""); }}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground"
              >
                Clear
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }}
          />
        </div>
      </div>
    </Field>
  );
}
