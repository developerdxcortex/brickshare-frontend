import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Input({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/70">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold-400/50 px-3 py-2.5 outline-none focus:border-gold-500"
      />
    </label>
  );
}

export function TextArea({
  label, value, onChange, rows = 4, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/70">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold-400/50 px-3 py-2.5 outline-none focus:border-gold-500"
      />
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

export function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold-400/50 bg-white px-3 py-2.5 outline-none focus:border-gold-500"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function Modal({
  title, onClose, children, wide = false,
}: {
  title: string; onClose: () => void; children: ReactNode; wide?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-7 shadow-card ${wide ? "max-w-2xl" : "max-w-lg"}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-ink/50 hover:text-ink"><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
