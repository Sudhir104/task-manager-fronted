import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("All fields required");
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your workspace</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKey}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKey}
          />
        </div>

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.footer}>
          No account?{" "}
          <Link to="/signup" style={styles.link}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden" },
  glow: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,138,255,0.12) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 44px", width: "100%", maxWidth: 420, position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  logoIcon: { fontSize: 28 },
  logoText: { fontFamily: "var(--heading)", fontSize: 22, color: "var(--white)", fontWeight: 800 },
  title: { fontFamily: "var(--heading)", fontSize: 30, color: "var(--white)", fontWeight: 800, marginBottom: 6 },
  sub: { color: "var(--text2)", fontSize: 15, marginBottom: 28 },
  error: { background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" },
  input: { width: "100%", padding: "13px 16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", fontSize: 15, outline: "none", transition: "border-color 0.2s" },
  btn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 8, letterSpacing: "0.02em" },
  footer: { textAlign: "center", marginTop: 24, color: "var(--text2)", fontSize: 14 },
  link: { color: "var(--accent)", textDecoration: "none", fontWeight: 600 },
};
