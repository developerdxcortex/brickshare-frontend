import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Logo from "../../components/Logo";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useSeo } from "../../lib/seo";

export default function AdminLogin() {
  useSeo({ title: "Admin Login — BrickShare Capital", description: "Admin area.", noindex: true });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    setErr("");
    setBusy(true);
    try {
      const { token } = await api.login(email, password);
      login(token);
      nav("/admin");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4 grain">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card"
      >
        <div className="flex justify-center"><Logo variant="dark" /></div>
        <div className="mt-6 flex items-center justify-center gap-2 text-ink">
          <Lock size={18} className="text-gold-500" />
          <h1 className="text-xl font-bold">Admin Login</h1>
        </div>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-lg border border-gold-400/50 px-4 py-3 outline-none focus:border-gold-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-lg border border-gold-400/50 px-4 py-3 outline-none focus:border-gold-500"
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
          <button onClick={submit} disabled={busy} className="btn-gold w-full disabled:opacity-60">
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}