"use client";
import Link from "next/link";

export default function LogPage() {
  return (
    <>
      <header className="app-header">
        <Link href="/" className="btn btn-ghost" style={{ padding: "8px 12px" }}>← Back</Link>
        <span className="text-title">Log Meal</span>
        <div style={{ width: 64 }} />
      </header>
      <main className="page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60dvh", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎙️</div>
        <h2 className="text-headline">Voice Logging</h2>
        <p className="text-body text-secondary" style={{ marginTop: 12, maxWidth: 280 }}>
          Say what you ate in Hindi, English, or Hinglish. Coming in Phase 2!
        </p>
        <Link href="/scan" className="btn btn-primary" style={{ marginTop: 32 }}>
          Try Menu Scan instead →
        </Link>
      </main>
    </>
  );
}
