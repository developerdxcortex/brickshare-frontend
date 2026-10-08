import { useRef, useState } from "react";
import { FileText, UploadCloud, X, Loader2, Trash2 } from "lucide-react";
import { api } from "../../lib/api";

export type PlanDocument = { label: string; url: string; key?: string };

export default function DocumentUpload({
  value,
  onChange,
  folder = "documents",
  label = "Documents",
}: {
  value: PlanDocument[];
  onChange: (docs: PlanDocument[]) => void;
  folder?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pendingLabel, setPendingLabel] = useState("");

  const docs = value || [];

  const pick = async (file?: File) => {
    if (!file) return;
    setErr("");
    if (file.type !== "application/pdf") {
      setErr("Only PDF files are allowed");
      return;
    }
    setBusy(true);
    try {
      const { url, key } = await api.upload(file, folder);
      onChange([
        ...docs,
        { label: pendingLabel.trim() || file.name.replace(/\.pdf$/i, ""), url, key },
      ]);
      setPendingLabel("");
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const removeAt = (i: number) => {
    onChange(docs.filter((_, idx) => idx !== i));
  };

  const relabel = (i: number, newLabel: string) => {
    onChange(docs.map((d, idx) => (idx === i ? { ...d, label: newLabel } : d)));
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink/70">{label}</label>

      {docs.length > 0 && (
        <div className="mb-3 space-y-2">
          {docs.map((d, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-cream p-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy text-gold-400">
                <FileText size={16} />
              </span>
              <input
                type="text"
                value={d.label}
                onChange={(e) => relabel(i, e.target.value)}
                placeholder="Document label"
                className="min-w-0 flex-1 rounded-md border border-gold-400/40 bg-white px-2 py-1.5 text-sm outline-none focus:border-gold-500"
              />
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs text-royal hover:underline"
              >
                View
              </a>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={pendingLabel}
          onChange={(e) => setPendingLabel(e.target.value)}
          placeholder="Label for next PDF (e.g. Investor Deck)"
          className="min-w-0 flex-1 rounded-lg border border-gold-400/40 px-3 py-2 text-sm outline-none focus:border-gold-500"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="flex shrink-0 items-center gap-2 rounded-lg border-2 border-dashed border-gold-400/60 bg-cream px-3 py-2 text-xs font-medium text-ink/60 transition-colors hover:border-gold-500 disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
          {busy ? "Uploading…" : "Upload PDF"}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
    </div>
  );
}
