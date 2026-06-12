import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  Building2, Newspaper, MessageSquareQuote, Inbox, LogOut, Plus, Pencil, Trash2,
  Eye, EyeOff, Home, Star,
} from "lucide-react";
import Logo from "../../components/Logo";
import { Loader } from "../../components/ui";
import { Input, TextArea, Select, Modal } from "../../components/admin/fields";
import ImageUpload from "../../components/admin/ImageUpload";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useSeo } from "../../lib/seo";

type Tab = "plans" | "articles" | "reviews" | "inquiries";

export default function AdminDashboard() {
  useSeo({ title: "Admin Dashboard — BrickShare Capital", description: "Admin area.", noindex: true });
  const [tab, setTab] = useState<Tab>("plans");
  const { logout } = useAuth();

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "plans", label: "Plans / Projects", icon: Building2 },
    { key: "articles", label: "Articles", icon: Newspaper },
    { key: "reviews", label: "Reviews", icon: MessageSquareQuote },
    { key: "inquiries", label: "Inquiries", icon: Inbox },
  ];

  const SidebarNav = (
    <>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            tab === t.key ? "bg-gold-400 text-navy shadow-gold" : "text-white/75 hover:bg-white/10"
          }`}
        >
          <t.icon size={18} /> {t.label}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* ===== Desktop fixed sidebar ===== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy p-5 lg:flex grain">
        <div className="relative z-10 flex h-full flex-col">
          <Link to="/"><Logo variant="light" /></Link>
          <p className="mt-6 text-xs uppercase tracking-wider text-white/40">Admin Panel</p>
          <nav className="mt-3 space-y-1">{SidebarNav}</nav>
          <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 hover:bg-white/10">
              <Home size={18} /> View Site
            </Link>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-300 hover:bg-white/10">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Mobile top bar ===== */}
      <div className="sticky top-0 z-40 bg-navy px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo variant="light" /></Link>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-300">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${
                tab === t.key ? "bg-gold-400 text-navy" : "bg-white/10 text-white/75"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Scrollable content ===== */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          {tab === "plans" && <PlansManager />}
          {tab === "articles" && <ArticlesManager />}
          {tab === "reviews" && <ReviewsManager />}
          {tab === "inquiries" && <InquiriesManager />}
        </div>
      </main>
    </div>
  );
}

/* ----------------------------- helpers ------------------------------------ */
function Header({ title, count, onAdd, subtitle }: { title: string; count?: number; onAdd?: () => void; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">
            {title}{" "}
            {typeof count === "number" && (
              <span className="align-middle text-base font-semibold text-ink/35">{count}</span>
            )}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-ink/55">{subtitle}</p>}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="btn-gold h-11 shrink-0">
            <Plus size={18} /> Add New
          </button>
        )}
      </div>
      <div className="mt-3 h-1 w-16 rounded-full bg-gold-400" />
    </div>
  );
}

function confirmDelete(msg: string) {
  return window.confirm(msg);
}

/* ============================== PLANS ===================================== */
const emptyPlan = {
  name: "", city: "Houston, TX", type: "High-Rise Apartments", minInvestment: "$25,000",
  targetReturn: "9-11% p.a.", status: "OPEN", image: "", imageKey: "", tagline: "",
  description: "", propertyValue: "", holdPeriod: "", fundedPercent: 0,
  highlightsText: "", published: true,
};

function PlansManager() {
  const [plans, setPlans] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  const load = () => api.adminPlans().then(setPlans).catch(() => setPlans([]));
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...emptyPlan });
  const openEdit = (p: any) =>
    setEditing({ ...p, highlightsText: (p.highlights || []).join("\n") });

  const save = async (form: any) => {
    const body = {
      ...form,
      fundedPercent: Number(form.fundedPercent) || 0,
      highlights: String(form.highlightsText || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
    };
    delete body.highlightsText;
    if (form._id) await api.updatePlan(form._id, body);
    else await api.createPlan(body);
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirmDelete("Delete this plan permanently?")) return;
    await api.deletePlan(id);
    load();
  };

  if (!plans) return <Loader />;

  return (
    <>
      <Header title="Plans / Projects" subtitle="Investment opportunities shown on the site" count={plans.length} onAdd={openNew} />
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div key={p._id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
            <img src={p.image} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover bg-cream"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-bold text-ink">{p.name}</h3>
                <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold text-white">{p.status}</span>
              </div>
              <p className="truncate text-sm text-ink/60">{p.city} · {p.type}</p>
              <p className="text-sm font-semibold text-gold-600">{p.minInvestment} · {p.targetReturn}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1 rounded-lg bg-cream px-3 py-1.5 text-xs font-medium text-ink hover:bg-peach">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => del(p._id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {plans.length === 0 && <p className="text-ink/50">No plans yet. Click "Add New".</p>}
      </div>

      <AnimatePresence>
        {editing && <PlanForm initial={editing} onClose={() => setEditing(null)} onSave={save} />}
      </AnimatePresence>
    </>
  );
}

function PlanForm({ initial, onClose, onSave }: { initial: any; onClose: () => void; onSave: (f: any) => void }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (v: any) => setF((x: any) => ({ ...x, [k]: v }));
  const submit = async () => {
    if (!f.name) return alert("Name required");
    setBusy(true);
    try { await onSave(f); } catch (e: any) { alert(e.message); } finally { setBusy(false); }
  };

  return (
    <Modal title={f._id ? "Edit Plan" : "Add Plan"} onClose={onClose} wide>
      <div className="space-y-4">
        <ImageUpload value={f.image} folder="plans" label="Cover Image"
          onChange={(url, key) => setF((x: any) => ({ ...x, image: url, imageKey: key ?? x.imageKey }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={f.name} onChange={set("name")} placeholder="Galleria Heights" />
          <Input label="City" value={f.city} onChange={set("city")} placeholder="Houston, TX" />
          <Input label="Type" value={f.type} onChange={set("type")} placeholder="High-Rise Apartments" />
          <Select label="Status" value={f.status} onChange={set("status")} options={["OPEN", "FUNDED", "CLOSED"]} />
          <Input label="Min. Investment" value={f.minInvestment} onChange={set("minInvestment")} placeholder="$25,000" />
          <Input label="Target Return" value={f.targetReturn} onChange={set("targetReturn")} placeholder="9-11% p.a." />
          <Input label="Property Value" value={f.propertyValue} onChange={set("propertyValue")} placeholder="$18.4M" />
          <Input label="Hold Period" value={f.holdPeriod} onChange={set("holdPeriod")} placeholder="3-5 years" />
          <Input label="Funded %" type="number" value={String(f.fundedPercent)} onChange={set("fundedPercent")} placeholder="62" />
        </div>
        <Input label="Tagline" value={f.tagline} onChange={set("tagline")} placeholder="Premium high-rise living in Uptown Houston" />
        <TextArea label="Description" value={f.description} onChange={set("description")} rows={4} />
        <TextArea label="Highlights" value={f.highlightsText} onChange={set("highlightsText")} rows={4}
          hint="Ek line me ek highlight likho (one per line)." />
        <button onClick={submit} disabled={busy} className="btn-gold w-full disabled:opacity-60">
          {busy ? "Saving…" : "Save Plan"}
        </button>
      </div>
    </Modal>
  );
}

/* ============================== ARTICLES ================================== */
const emptyArticle = {
  title: "", category: "Investing Basics", excerpt: "", content: "", readTime: "5 min read",
  image: "", imageKey: "", author: "BrickShare Team", published: true,
};

function ArticlesManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const load = () => api.adminArticles().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async (form: any) => {
    if (form._id) await api.updateArticle(form._id, form);
    else await api.createArticle(form);
    setEditing(null);
    load();
  };
  const del = async (id: string) => {
    if (!confirmDelete("Delete this article?")) return;
    await api.deleteArticle(id); load();
  };

  if (!items) return <Loader />;

  return (
    <>
      <Header title="Articles" subtitle="Education content & guides" count={items.length} onAdd={() => setEditing({ ...emptyArticle })} />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((a) => (
          <div key={a._id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
            <img src={a.image} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover bg-cream"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")} />
            <div className="min-w-0 flex-1">
              <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold text-navy">{a.category}</span>
              <h3 className="mt-1 truncate font-bold text-ink">{a.title}</h3>
              <p className="line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setEditing(a)} className="inline-flex items-center gap-1 rounded-lg bg-cream px-3 py-1.5 text-xs font-medium hover:bg-peach">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => del(a._id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/50">No articles yet. Click "Add New".</p>}
      </div>

      <AnimatePresence>
        {editing && <ArticleForm initial={editing} onClose={() => setEditing(null)} onSave={save} />}
      </AnimatePresence>
    </>
  );
}

function ArticleForm({ initial, onClose, onSave }: { initial: any; onClose: () => void; onSave: (f: any) => void }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (v: any) => setF((x: any) => ({ ...x, [k]: v }));
  const submit = async () => {
    if (!f.title) return alert("Title required");
    setBusy(true);
    try { await onSave(f); } catch (e: any) { alert(e.message); } finally { setBusy(false); }
  };

  return (
    <Modal title={f._id ? "Edit Article" : "Add Article"} onClose={onClose} wide>
      <div className="space-y-4">
        <ImageUpload value={f.image} folder="articles" label="Cover Image"
          onChange={(url, key) => setF((x: any) => ({ ...x, image: url, imageKey: key ?? x.imageKey }))} />
        <Input label="Title" value={f.title} onChange={set("title")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Category" value={f.category} onChange={set("category")}
            options={["Investing Basics", "Tax Tips", "Houston Market Trends", "Wealth Mindset"]} />
          <Input label="Read Time" value={f.readTime} onChange={set("readTime")} placeholder="5 min read" />
        </div>
        <Input label="Author" value={f.author} onChange={set("author")} />
        <TextArea label="Excerpt (card preview)" value={f.excerpt} onChange={set("excerpt")} rows={2} />
        <TextArea label="Full Content (detail page)" value={f.content} onChange={set("content")} rows={8}
          hint="Naye paragraph ke liye ek blank line chhodo." />
        <button onClick={submit} disabled={busy} className="btn-gold w-full disabled:opacity-60">
          {busy ? "Saving…" : "Save Article"}
        </button>
      </div>
    </Modal>
  );
}

/* ============================== REVIEWS =================================== */
function ReviewsManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const load = () => api.adminReviews().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const toggle = async (r: any) => { await api.updateReview(r._id, { approved: !r.approved }); load(); };
  const del = async (id: string) => {
    if (!confirmDelete("Delete this review?")) return;
    await api.deleteReview(id); load();
  };

  if (!items) return <Loader />;

  return (
    <>
      <Header title="Reviews" subtitle="Hide or delete participant reviews" count={items.length} />
      <div className="space-y-4">
        {items.map((r) => (
          <div key={r._id} className={`rounded-2xl bg-white p-5 shadow-soft ${!r.approved && "opacity-60"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-ink">{r.name}</p>
                  {r.location && <span className="text-xs text-ink/50">· {r.location}</span>}
                  <span className="flex gap-0.5 text-gold-500">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/75">"{r.quote}"</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => toggle(r)} title={r.approved ? "Hide" : "Show"}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-cream text-ink hover:bg-peach">
                  {r.approved ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => del(r._id)}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/50">No reviews yet.</p>}
      </div>
    </>
  );
}

/* ============================== INQUIRIES ================================= */
function InquiriesManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const load = () => api.adminInquiries().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    if (!confirmDelete("Delete this inquiry?")) return;
    await api.deleteInquiry(id); load();
  };
  if (!items) return <Loader />;

  return (
    <>
      <Header title="Inquiries" subtitle="Contact form submissions" count={items.length} />
      <div className="space-y-4">
        {items.map((q) => (
          <div key={q._id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-ink">{q.name}</p>
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-ink/60">{q.source}</span>
                  <span className="text-xs text-ink/40">{new Date(q.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  <a href={`mailto:${q.email}`} className="text-royal hover:underline">{q.email}</a>
                  {q.phone && <span> · {q.phone}</span>}
                </p>
                {q.subject && <p className="mt-1 text-sm font-medium text-ink">{q.subject}</p>}
                {q.message && <p className="mt-1 text-sm text-ink/70">{q.message}</p>}
              </div>
              <button onClick={() => del(q._id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/50">No inquiries yet.</p>}
      </div>
    </>
  );
}