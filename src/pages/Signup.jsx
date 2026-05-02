import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return setError("All fields required");
    try {
      setLoading(true);
      setError("");
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.sub}>Join your team workspace</p>

        {error && <div style={styles.error}>{error}</div>}

        {[["Name", "name", "text", "Sudhir Mathur"], ["Email", "email", "email", "you@example.com"], ["Password", "password", "password", "••••••••"]].map(([label, key, type, ph]) => (
          <div key={key} style={styles.field}>
            <label style={styles.label}>{label}</label>
            <input
              style={styles.input}
              type={type}
              placeholder={ph}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={styles.footer}>
          Have account?{" "}
          <Link to="/login" style={styles.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden" },
  glow: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 44px", width: "100%", maxWidth: 420, position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  logoIcon: { fontSize: 28 },
  logoText: { fontFamily: "var(--heading)", fontSize: 22, color: "var(--white)", fontWeight: 800 },
  title: { fontFamily: "var(--heading)", fontSize: 30, color: "var(--white)", fontWeight: 800, marginBottom: 6 },
  sub: { color: "var(--text2)", fontSize: 15, marginBottom: 28 },
  error: { background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" },
  input: { width: "100%", padding: "13px 16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", fontSize: 15, outline: "none" },
  btn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 8 },
  footer: { textAlign: "center", marginTop: 24, color: "var(--text2)", fontSize: 14 },
  link: { color: "var(--accent)", textDecoration: "none", fontWeight: 600 },
};
