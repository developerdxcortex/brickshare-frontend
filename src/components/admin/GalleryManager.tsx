import { useEffect, useMemo, useRef, useState } from "react";
import {
  UploadCloud, Loader2, Trash2, Eye, EyeOff, Home, ArrowUp, ArrowDown, X, Images, ArrowLeftRight, Check,
} from "lucide-react";
import { Loader } from "../ui";
import { api, type GalleryItem, type GalleryType } from "../../lib/api";

const BATCH = 10; // files per request (large bulk uploads are sent in chunks)
const MAX_MB = 15;

type Picked = { file: File; preview: string };

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [type, setType] = useState<GalleryType>("gallery");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => api.adminGallery().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  // clear selection when switching type
  useEffect(() => { setSelected(new Set()); }, [type]);

  const list = useMemo(
    () => (items || []).filter((i) => i.type === type).sort((a, b) => a.order - b.order),
    [items, type]
  );
  const counts = useMemo(() => ({
    gallery: (items || []).filter((i) => i.type === "gallery").length,
    beforeAfter: (items || []).filter((i) => i.type === "beforeAfter").length,
  }), [items]);
  const homeCount = list.filter((i) => i.showOnHome && i.published).length;

  /* ------------------------------ picking ------------------------------ */
  const addFiles = (files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const bad = arr.filter((f) => !f.type.startsWith("image/") || f.size > MAX_MB * 1024 * 1024);
    const good = arr.filter((f) => !bad.includes(f));
    setPicked((p) => [...p, ...good.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    setMsg(bad.length ? { ok: false, text: `${bad.length} file(s) skipped (not an image or larger than ${MAX_MB} MB).` } : null);
  };
  const removePicked = (i: number) =>
    setPicked((p) => {
      URL.revokeObjectURL(p[i].preview);
      return p.filter((_, j) => j !== i);
    });
  const clearPicked = () => {
    picked.forEach((p) => URL.revokeObjectURL(p.preview));
    setPicked([]);
  };

  /* ------------------------------ upload ------------------------------- */
  const upload = async () => {
    if (!picked.length) return;
    setMsg(null);
    const files = picked.map((p) => p.file);
    const failed: string[] = [];
    let created = 0;
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i += BATCH) {
      const chunk = files.slice(i, i + BATCH);
      try {
        const res = await api.uploadGalleryBulk(chunk, type);
        created += res.created.length;
        failed.push(...res.failed.map((f) => f.name));
      } catch (e: any) {
        failed.push(...chunk.map((f) => `${f.name} (${e.message})`));
      }
      setProgress({ done: Math.min(i + BATCH, files.length), total: files.length });
    }
    setProgress(null);
    clearPicked();
    await load();
    setMsg(
      failed.length
        ? { ok: false, text: `${created} uploaded, ${failed.length} failed: ${failed.join(", ")}` }
        : { ok: true, text: `${created} image${created === 1 ? "" : "s"} uploaded successfully ✓` }
    );
  };

  /* ------------------------------ actions ------------------------------ */
  const patch = async (it: GalleryItem, body: Partial<GalleryItem>) => {
    setItems((all) => all && all.map((x) => (x._id === it._id ? { ...x, ...body } : x)));
    try { await api.updateGallery(it._id, body); } catch { load(); }
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const ids = list.map((i) => i._id);
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    setItems((all) => all && all.map((x) => (ids.includes(x._id) ? { ...x, order: ids.indexOf(x._id) } : x)));
    try { await api.reorderGallery(ids); } catch { load(); }
  };
  const del = async (id: string) => {
    if (!window.confirm("Delete this image? It will also be removed from S3.")) return;
    await api.deleteGallery(id);
    load();
  };
  const delSelected = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} images? They will also be removed from S3.`)) return;
    await api.bulkDeleteGallery([...selected]);
    setSelected(new Set());
    load();
  };
  const toggleSel = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allSelected = list.length > 0 && list.every((i) => selected.has(i._id));

  if (!items) return <Loader />;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy">
          Gallery <span className="align-middle text-base font-semibold text-ink/35">{items.length}</span>
        </h1>
        <p className="mt-0.5 text-sm text-ink/55">
          Gallery photos and before &amp; after images
        </p>
        <div className="mt-3 h-1 w-16 rounded-full bg-gold-400" />
      </div>

      {/* Type switch */}
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          { k: "gallery", label: "Photos", icon: Images },
          { k: "beforeAfter", label: "Before & After", icon: ArrowLeftRight },
        ] as const).map((t) => (
          <button
            key={t.k}
            onClick={() => setType(t.k)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              type === t.k ? "bg-navy text-gold-400" : "bg-white text-ink/70 shadow-soft hover:bg-gold-400/20"
            }`}
          >
            <t.icon size={16} /> {t.label}
            <span className="rounded-full bg-black/10 px-2 text-xs">{counts[t.k]}</span>
          </button>
        ))}
      </div>

      {/* Upload box */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <div
          onClick={() => !progress && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); if (!progress) addFiles(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
            drag ? "border-gold-500 bg-gold-400/15" : "border-gold-400/60 bg-cream hover:border-gold-500"
          }`}
        >
          <UploadCloud size={28} className="text-gold-500" />
          <p className="font-semibold text-ink">
            {type === "gallery" ? "Photos" : "Before & After images"}: drag &amp; drop here or click to select
          </p>
          <p className="text-xs text-ink/50">
            Select multiple images at once · JPG, PNG, WEBP · max {MAX_MB} MB each
            {type === "beforeAfter" && " · Before + After must be a single combined image"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>

        {picked.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {picked.map((p, i) => (
                <div key={p.preview} className="relative">
                  <img src={p.preview} alt="" className="aspect-square w-full rounded-lg object-cover ring-1 ring-black/10" />
                  {!progress && (
                    <button
                      onClick={() => removePicked(i)}
                      className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={upload} disabled={!!progress} className="btn-gold h-11 disabled:opacity-60">
                {progress ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                {progress
                  ? `Uploading ${progress.done}/${progress.total}…`
                  : `Upload ${picked.length} image${picked.length === 1 ? "" : "s"}`}
              </button>
              {!progress && (
                <button onClick={clearPicked} className="text-sm text-ink/60 hover:text-red-600">
                  Clear
                </button>
              )}
            </div>
            {progress && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream">
                <div
                  className="h-full rounded-full bg-gold-500 transition-all"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            )}
          </>
        )}
        {msg && (
          <p className={`mt-3 text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
        )}
      </div>

      {/* Toolbar */}
      {list.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelected(allSelected ? new Set() : new Set(list.map((i) => i._id)))}
            className="flex items-center gap-2 text-sm font-medium text-ink/70"
          >
            <Box on={allSelected} /> Select all
          </button>
          <div className="flex items-center gap-3">
            {type === "gallery" && (
              <span className="text-xs text-ink/55">
                <Home size={12} className="inline" /> Marked for Home: {homeCount} (6 are shown; if fewer are marked, the rest are filled by order)
              </span>
            )}
            {selected.size > 0 && (
              <button onClick={delSelected} className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                <Trash2 size={16} /> Delete {selected.size}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className={`mt-4 grid gap-4 ${type === "gallery" ? "sm:grid-cols-2 lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {list.map((it, idx) => (
          <div
            key={it._id}
            className={`overflow-hidden rounded-2xl bg-white shadow-soft ring-2 ${
              selected.has(it._id) ? "ring-gold-500" : "ring-transparent"
            } ${it.published ? "" : "opacity-60"}`}
          >
            <div className="relative">
              <img
                src={it.url}
                alt=""
                className={`w-full bg-cream ${type === "gallery" ? "aspect-[4/3] object-cover" : "h-40 object-contain"}`}
              />
              <button
                onClick={() => toggleSel(it._id)}
                className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-white/90 shadow"
              >
                <Box on={selected.has(it._id)} />
              </button>
              <span className="absolute right-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-bold text-gold-400">
                #{idx + 1}
              </span>
              {type === "gallery" && it.showOnHome && (
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-navy">
                  <Home size={10} /> Home
                </span>
              )}
            </div>
            <div className="space-y-3 p-3">
              <input
                defaultValue={it.title || ""}
                placeholder="Caption (optional)"
                onBlur={(e) => e.target.value !== (it.title || "") && patch(it, { title: e.target.value })}
                className="w-full rounded-lg border border-gold-400/40 px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <IconBtn title="Move up" onClick={() => move(idx, -1)} disabled={idx === 0}><ArrowUp size={15} /></IconBtn>
                  <IconBtn title="Move down" onClick={() => move(idx, 1)} disabled={idx === list.length - 1}><ArrowDown size={15} /></IconBtn>
                </div>
                <div className="flex gap-1">
                  {type === "gallery" && (
                    <IconBtn
                      title={it.showOnHome ? "Remove from Home" : "Show on Home"}
                      active={it.showOnHome}
                      onClick={() => patch(it, { showOnHome: !it.showOnHome })}
                    >
                      <Home size={15} />
                    </IconBtn>
                  )}
                  <IconBtn
                    title={it.published ? "Hide" : "Show"}
                    onClick={() => patch(it, { published: !it.published })}
                  >
                    {it.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </IconBtn>
                  <button
                    onClick={() => del(it._id)}
                    title="Delete"
                    className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-6 text-ink/50">
          No {type === "gallery" ? "photos" : "before/after images"} yet. Upload some above.
        </p>
      )}
    </>
  );
}

function IconBtn({
  children, onClick, title, disabled, active,
}: {
  children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-lg transition disabled:opacity-30 ${
        active ? "bg-gold-400 text-navy" : "bg-cream text-ink/60 hover:bg-gold-400/30"
      }`}
    >
      {children}
    </button>
  );
}

function Box({ on }: { on: boolean }) {
  return (
    <span
      className={`grid h-[18px] w-[18px] place-items-center rounded border-2 ${
        on ? "border-gold-500 bg-gold-400 text-navy" : "border-ink/40 bg-white"
      }`}
    >
      {on && <Check size={12} strokeWidth={3} />}
    </span>
  );
}