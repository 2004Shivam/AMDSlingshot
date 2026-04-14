"use client";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <>
      <header className="app-header">
        <Link href="/" className="btn btn-ghost" style={{ padding: "8px 12px" }}>← Back</Link>
        <span className="text-title">Meal History</span>
        <div style={{ width: 64 }} />
      </header>
      <main className="page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60dvh", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
        <h2 className="text-headline">Your meal history</h2>
        <p className="text-body text-secondary" style={{ marginTop: 12, maxWidth: 280 }}>
          Log your first meal to start building your food story.
        </p>
        <Link href="/scan" className="btn btn-primary" style={{ marginTop: 32 }}>
          📷 Scan a Menu
        </Link>
      </main>
    </>
  );
}
