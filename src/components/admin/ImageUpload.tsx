import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: {
  value?: string;
  onChange: (url: string, key?: string) => void;
  folder?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (file?: File) => {
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const { url, key } = await api.upload(file, folder);
      onChange(url, key);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink/70">{label}</label>
      {value ? (
        <div className="relative w-fit">
          <img src={value} alt="" className="h-28 w-44 rounded-lg object-cover ring-1 ring-black/10" />
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="flex h-28 w-44 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold-400/60 bg-cream text-ink/60 transition-colors hover:border-gold-500"
        >
          {busy ? <Loader2 className="animate-spin" size={22} /> : <UploadCloud size={22} />}
          <span className="text-xs">{busy ? "Uploading…" : "Click to upload"}</span>
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {/* Manual URL fallback (agar S3 setup nahi hai toh direct link paste kar sakte ho) */}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="mt-2 w-full rounded-lg border border-gold-400/40 px-3 py-2 text-sm outline-none focus:border-gold-500"
      />
      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
    </div>
  );
}
