import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  adminGetSettings, adminUpdateSettings,
  adminListEmailTemplates, adminUpsertEmailTemplate, adminDeleteEmailTemplate,
} from "@/lib/settings.functions";
import { siteSettingsSchema, emailTemplateSchema } from "@/lib/settings-schema";
import { AdminHeader, Field, inputCls } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

const TABS = ["general", "email", "templates", "analytics", "scripts"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  general: "General", email: "Email", templates: "Email templates",
  analytics: "Analytics", scripts: "Custom scripts",
};

const emptyTemplate = { key: "", name: "", subject: "", body: "", description: "", enabled: true };

function SettingsAdmin() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("general");
  const { data: settings } = useQuery({ queryKey: ["siteSettings"], queryFn: () => adminGetSettings() });
  const [v, setV] = useState<any>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});

  useEffect(() => { if (settings && !v) setV({ ...settings }); }, [settings, v]);

  const save = useMutation({
    mutationFn: (payload: any) => adminUpdateSettings({ data: payload }),
    onSuccess: () => { toast.success("Configuration saved"); qc.invalidateQueries({ queryKey: ["siteSettings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = siteSettingsSchema.safeParse({
      ...v,
      maintenance_banner_enabled: !!v.maintenance_banner_enabled,
    });
    if (!parsed.success) {
      const e2: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { e2[i.path[0] as string] = i.message; });
      setErrs(e2); toast.error("Fix the highlighted fields"); return;
    }
    setErrs({}); save.mutate(parsed.data);
  }

  if (!v) return <div className="text-xs font-mono text-muted-foreground">Loading configuration…</div>;

  return (
    <>
      <AdminHeader title="Configuration" subtitle="Site identity, email delivery, tracking and custom scripts." />

      <div className="flex flex-wrap gap-px bg-border ring-1 ring-border mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] ${tab === t ? "bg-foreground text-background" : "bg-background text-muted-foreground"}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "templates" ? (
        <Templates />
      ) : (
        <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4">
          {tab === "general" && (
            <>
              <Field label="Site name" error={errs.site_name}><input className={inputCls} value={v.site_name ?? ""} onChange={(e) => set("site_name", e.target.value)} /></Field>
              <Field label="Tagline" error={errs.tagline}><input className={inputCls} value={v.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} /></Field>
              <Field label="Contact email" error={errs.contact_email}><input className={inputCls} value={v.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} /></Field>
              <Field label="Support email" error={errs.support_email}><input className={inputCls} value={v.support_email ?? ""} onChange={(e) => set("support_email", e.target.value)} /></Field>
              <Field label="Instagram URL" error={errs.social_instagram}><input className={inputCls} value={v.social_instagram ?? ""} onChange={(e) => set("social_instagram", e.target.value)} /></Field>
              <Field label="X / Twitter URL" error={errs.social_x}><input className={inputCls} value={v.social_x ?? ""} onChange={(e) => set("social_x", e.target.value)} /></Field>
              <Field label="YouTube URL" error={errs.social_youtube}><input className={inputCls} value={v.social_youtube ?? ""} onChange={(e) => set("social_youtube", e.target.value)} /></Field>
              <Field label="LinkedIn URL" error={errs.social_linkedin}><input className={inputCls} value={v.social_linkedin ?? ""} onChange={(e) => set("social_linkedin", e.target.value)} /></Field>
              <div className="md:col-span-2">
                <Field label="Site-wide banner" hint="Shown at the top of every page when enabled." error={errs.maintenance_banner}>
                  <input className={inputCls} value={v.maintenance_banner ?? ""} onChange={(e) => set("maintenance_banner", e.target.value)} />
                </Field>
                <label className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <input type="checkbox" checked={!!v.maintenance_banner_enabled} onChange={(e) => set("maintenance_banner_enabled", e.target.checked)} />
                  Banner enabled
                </label>
              </div>
            </>
          )}

          {tab === "email" && (
            <>
              <Field label="Sender name" error={errs.email_from_name}><input className={inputCls} value={v.email_from_name ?? ""} onChange={(e) => set("email_from_name", e.target.value)} /></Field>
              <Field label="Sender address" hint="Must be on a verified sending domain." error={errs.email_from_address}><input className={inputCls} value={v.email_from_address ?? ""} onChange={(e) => set("email_from_address", e.target.value)} /></Field>
              <Field label="Reply-to address" error={errs.email_reply_to}><input className={inputCls} value={v.email_reply_to ?? ""} onChange={(e) => set("email_reply_to", e.target.value)} /></Field>
              <div className="md:col-span-2 text-[11px] text-muted-foreground font-mono leading-relaxed">
                Outbound email requires a verified sending domain. Once the domain is verified these values are used as the from/reply-to on every transactional email.
              </div>
            </>
          )}

          {tab === "analytics" && (
            <>
              <Field label="Google Analytics ID" hint="G-XXXXXXXXXX" error={errs.google_analytics_id}><input className={inputCls} value={v.google_analytics_id ?? ""} onChange={(e) => set("google_analytics_id", e.target.value)} /></Field>
              <Field label="Google Tag Manager ID" hint="GTM-XXXXXX" error={errs.gtm_id}><input className={inputCls} value={v.gtm_id ?? ""} onChange={(e) => set("gtm_id", e.target.value)} /></Field>
              <Field label="Meta Pixel ID" error={errs.meta_pixel_id}><input className={inputCls} value={v.meta_pixel_id ?? ""} onChange={(e) => set("meta_pixel_id", e.target.value)} /></Field>
              <div className="md:col-span-2 text-[11px] text-muted-foreground font-mono">
                Built-in first-party analytics keep recording regardless — see the Analytics section.
              </div>
            </>
          )}

          {tab === "scripts" && (
            <>
              <div className="md:col-span-2">
                <Field label="Custom head scripts" hint="Injected into <head> on every public page." error={errs.custom_head_scripts}>
                  <textarea rows={8} className={`${inputCls} font-mono text-xs`} value={v.custom_head_scripts ?? ""} onChange={(e) => set("custom_head_scripts", e.target.value)} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Custom body scripts" hint="Injected at the end of <body>." error={errs.custom_body_scripts}>
                  <textarea rows={8} className={`${inputCls} font-mono text-xs`} value={v.custom_body_scripts ?? ""} onChange={(e) => set("custom_body_scripts", e.target.value)} />
                </Field>
              </div>
              <p className="md:col-span-2 text-[11px] font-mono text-[var(--crimson)]">
                Anything pasted here runs on every visitor's browser. Only add code you trust.
              </p>
            </>
          )}

          <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
            <button disabled={save.isPending} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">
              {save.isPending ? "Saving…" : "Save configuration"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

function Templates() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["emailTemplates"], queryFn: () => adminListEmailTemplates() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (p: any) => adminUpsertEmailTemplate({ data: p }),
    onSuccess: () => { toast.success("Template saved"); qc.invalidateQueries({ queryKey: ["emailTemplates"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteEmailTemplate({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["emailTemplates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({ ...emptyTemplate })} className="bg-foreground text-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em]">+ New template</button>
      </div>
      {editing && <TemplateForm initial={editing} busy={save.isPending} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} />}
      <ul className="divide-y divide-border ring-1 ring-border mt-6">
        {(data as any[]).map((t) => (
          <li key={t.id} className="p-4 bg-background flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{t.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
                {t.key} · {t.enabled ? "Enabled" : "Disabled"} · {t.subject}
              </div>
            </div>
            <button onClick={() => setEditing(t)} className="ring-1 ring-border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Edit</button>
            <button onClick={() => { if (confirm(`Delete "${t.name}"?`)) del.mutate(t.id); }} className="ring-1 ring-[var(--crimson)] text-[var(--crimson)] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function TemplateForm({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (p: any) => void; busy: boolean }) {
  const [v, setV] = useState<any>(initial);
  const [errs, setErrs] = useState<Record<string, string>>({});
  function set(k: string, val: any) { setV((p: any) => ({ ...p, [k]: val })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailTemplateSchema.safeParse({ ...v, enabled: !!v.enabled });
    if (!parsed.success) {
      const e2: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { e2[i.path[0] as string] = i.message; });
      setErrs(e2); toast.error("Fix the highlighted fields"); return;
    }
    setErrs({}); onSave(parsed.data);
  }
  return (
    <form onSubmit={submit} className="bg-[var(--surface)] ring-1 ring-border p-6 grid md:grid-cols-2 gap-4">
      <h3 className="md:col-span-2 font-display text-2xl">{v.id ? "Edit template" : "New template"}</h3>
      <Field label="Key" hint="lowercase_with_underscores" error={errs.key}><input className={inputCls} value={v.key ?? ""} onChange={(e) => set("key", e.target.value)} /></Field>
      <Field label="Name" error={errs.name}><input className={inputCls} value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
      <div className="md:col-span-2"><Field label="Subject" hint="Use {{placeholders}} for merge fields." error={errs.subject}><input className={inputCls} value={v.subject ?? ""} onChange={(e) => set("subject", e.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Body" error={errs.body}><textarea rows={10} className={`${inputCls} font-mono text-xs`} value={v.body ?? ""} onChange={(e) => set("body", e.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Description" error={errs.description}><input className={inputCls} value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field></div>
      <label className="md:col-span-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <input type="checkbox" checked={!!v.enabled} onChange={(e) => set("enabled", e.target.checked)} /> Enabled
      </label>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Cancel</button>
        <button disabled={busy} className="bg-[var(--crimson)] text-white px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
}
