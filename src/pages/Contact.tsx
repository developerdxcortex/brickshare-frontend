import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import Reveal from "../components/Reveal";
import { images, contact } from "../config/site";
import { api } from "../lib/api";
import { useSeo, pageSeo } from "../lib/seo";

export default function Contact() {
  useSeo(pageSeo("/contact"));
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    if (!form.name || !form.email) return setErr("Name aur email zaroori hai.");
    setBusy(true);
    try {
      await api.submitContact({ ...form, source: "contact" });
      setSent(true);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const cards = [
    { icon: MapPin, label: "Location", lines: [contact.location] },
    { icon: Mail, label: "Email", lines: contact.emails },
    { icon: Phone, label: "Phone", lines: contact.phones },
    { icon: Clock, label: "Business Hours", lines: contact.hours},
  ];

  return (
    <>
      {/* Hero + form */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7BA_100%)]">
        <div className="grid lg:grid-cols-2">
          {/* Left: heading + building image */}
          <div className="flex flex-col">
            <div className="px-6 pt-12 sm:px-12">
              <Reveal>
                <h1 className="text-4xl font-medium leading-tight text-[#000000] sm:text-5xl">
                  Let's Build Wealth<br />Together
                </h1>
              </Reveal>
            </div>
            <div className="mt-8 flex-1">
              <img
                src={images.heroContact}
                alt="Glass tower"
                className="h-80 w-full object-cover object-center lg:h-[610px]"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="px-6 py-12 sm:px-12">
            <Reveal>
              <h2 className="text-2xl font-medium leading-snug text-[#D8A014]">
                Have questions about our investment opportunities or want to explore a partnership
                with Brickscapital LLC?
              </h2>
              <div className="my-5 h-px w-full" />
              <p className="text-[#111111] font-regular font-sm">Our team is here to help you every step of the way.</p>

              <div className="mt-6 rounded-2xl bg-white p-6 border border-[#F7DC3F] shadow-[0px_4px_8.3px_0px_#13162724] sm:p-8">
                <h3 className="text-xl font-bold text-ink">Request More Information</h3>
                <div className="mt-5 space-y-4">
                  <Field label="Your Name" value={form.name} onChange={set("name")} />
                  <Field label="Your Phone" value={form.phone} onChange={set("phone")} />
                  <Field label="Your Email" value={form.email} onChange={set("email")} type="email" />
                  <Field label="Subject" value={form.subject} onChange={set("subject")} />
                  <Field label="Your Message" value={form.message} onChange={set("message")} textarea />

                  {err && <p className="text-sm text-red-500">{err}</p>}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={submit}
                    disabled={busy || sent}
                    className="w-full rounded-full bg-[#131627] py-4 font-semibold text-[#FEDF27]  hover:opacity-90 border border-[#FEDF27] shadow-[0px_4px_11.5px_0px_#988723]"
                  >
                    {sent ? "Inquiry Submitted ✓ — Check your inbox" : busy ? "Submitting…" : "Submit Inquiry"}
                  </motion.button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
          <div className="section py-16">
          <Reveal>
            <div className="mb-3 h-px w-full max-w-xs bg-[linear-gradient(90deg,rgba(21,47,194,0)_0%,#0F228C_52.82%,rgba(10,22,92,0)_100%)]" />
            <h2 className="text-3xl font-semibold leading-tight text-[#152FC2]">
              Get in Touch<br />Brickscapital LLC
            </h2>
            <div className="mt-3 h-px w-full max-w-xs bg-[linear-gradient(90deg,rgba(21,47,194,0)_0%,#0F228C_52.82%,rgba(10,22,92,0)_100%)]" />
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex gap-4 rounded-2xl bg-white p-6 border border-[#E4C300] shadow-[0px_4px_5.3px_0px_#FEDF2747]"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(180deg,#FFE966_0%,#AC960F_100%)] text-[#131627]">
                    <c.icon size={20} />
                  </div>
                  <div>
                    <p className="font-regular text-sm text-[#131627]">{c.label}</p>
                    {c.lines.map((l) => (
                      <p key={l} className="mt-1 font-semibold text-sm text-[#131627]">{l}</p>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
     
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
}) {
  const id = "f-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const inputClass =
    "peer w-full rounded-xl border border-[#E4C300] bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-[#E4C300]";
  const labelClass =
    `pointer-events-none absolute left-3 bg-white px-1 text-sm text-[#000000] font-regular transition-all duration-200 ${
      textarea ? "top-4" : "top-1/2 -translate-y-1/2"
    } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs`;

  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} placeholder=" " value={value} onChange={onChange} rows={4} className={inputClass} />
      ) : (
        <input id={id} type={type} placeholder=" " value={value} onChange={onChange} className={inputClass} />
      )}
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  );
}