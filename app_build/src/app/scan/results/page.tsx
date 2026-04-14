"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./results.module.css";

interface Recommendation {
  rank: number;
  dish_name: string;
  score: number;
  reasoning: string;
  estimated_price_inr: number;
  macro_estimate: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    calories_kcal: number;
  };
  flags: string[];
}

interface ScanResult {
  scan_id: string;
  recommendations: Recommendation[];
  avoid_list: { dish_name: string; reason: string }[];
  model_used: string;
  latency_ms: number;
}

export default function ScanResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    const r = sessionStorage.getItem("evee_scan_result");
    const p = sessionStorage.getItem("evee_scan_preview");
    if (r) setResult(JSON.parse(r));
    if (p) setPreview(p);
  }, []);

  const scoreClass = (score: number) => {
    if (score >= 80) return "score-badge-high";
    if (score >= 60) return "score-badge-mid";
    return "score-badge-low";
  };

  const rankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    return "🥉";
  };

  const flagLabel: Record<string, { label: string; cls: string }> = {
    budget_safe: { label: "✅ Budget safe", cls: "chip-success" },
    goal_aligned: { label: "🎯 Goal aligned", cls: "chip-indigo" },
    high_protein: { label: "💪 High protein", cls: "chip-ember" },
    low_fat: { label: "🌱 Low fat", cls: "chip-success" },
  };

  if (!result) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p className="text-body text-secondary">Loading results...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <Link href="/scan" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
          ← Rescan
        </Link>
        <span className="text-title">Best Options</span>
        <Link href="/" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
          🏠
        </Link>
      </header>

      <main className="page-content">

        {/* Menu thumbnail */}
        {preview && (
          <div className={styles.thumbnailRow}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Scanned menu" className={styles.thumbnail} />
            <div className="flex-col gap-1" style={{ flex: 1 }}>
              <p className="text-title">{result.recommendations.length} dishes ranked</p>
              <p className="text-body text-secondary">Personalized for your goal + budget</p>
              <div className={`chip chip-indigo`} style={{ width: "fit-content", marginTop: 4 }}>
                ✨ {result.model_used} · {(result.latency_ms / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="flex-col gap-3">
          <p className="text-label text-tertiary">Ranked recommendations</p>

          {result.recommendations.map((rec) => (
            <div
              key={rec.rank}
              className={`card ${rec.rank === 1 ? "card-ember" : ""} ${styles.recCard}`}
              onClick={() => setExpanded(expanded === rec.rank ? null : rec.rank)}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 24 }}>{rankEmoji(rec.rank)}</span>
                  <div>
                    <p className="text-body-lg" style={{ fontWeight: 700 }}>{rec.dish_name}</p>
                    <p className="text-body text-secondary">₹{rec.estimated_price_inr}</p>
                  </div>
                </div>
                <div className={`score-badge ${scoreClass(rec.score)}`}>{rec.score}</div>
              </div>

              {/* Flags */}
              <div className="flex gap-2" style={{ marginTop: 12, flexWrap: "wrap" }}>
                {rec.flags.map((flag) =>
                  flagLabel[flag] ? (
                    <span key={flag} className={`chip ${flagLabel[flag].cls}`}>
                      {flagLabel[flag].label}
                    </span>
                  ) : null
                )}
              </div>

              {/* Expanded: AI reasoning + macros */}
              {expanded === rec.rank && (
                <div className={styles.expanded}>
                  {/* AI Reasoning bubble */}
                  <div className={`${styles.aiReasoning} card-indigo card`}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                      <span>🤖</span>
                      <span className="text-label text-indigo">Evee says</span>
                    </div>
                    <p className="text-body">{rec.reasoning}</p>
                  </div>

                  {/* Macros */}
                  <div className={styles.macroGrid}>
                    {[
                      { label: "Calories", val: `${rec.macro_estimate.calories_kcal}`, unit: "kcal" },
                      { label: "Protein", val: `${rec.macro_estimate.protein_g}`, unit: "g", color: "var(--ember)" },
                      { label: "Carbs", val: `${rec.macro_estimate.carbs_g}`, unit: "g", color: "var(--gold)" },
                      { label: "Fat", val: `${rec.macro_estimate.fat_g}`, unit: "g", color: "var(--indigo)" },
                    ].map((m) => (
                      <div key={m.label} className={styles.macroItem}>
                        <span className="text-caption text-tertiary">{m.label}</span>
                        <span className="text-title" style={{ color: m.color || "var(--text-primary)" }}>
                          {m.val}
                          <span className="text-caption text-tertiary"> {m.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.expandHint}>
                <span className="text-caption text-tertiary">
                  {expanded === rec.rank ? "▲ Hide details" : "▼ See AI reasoning"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Avoid List */}
        {result.avoid_list?.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <p className="text-label text-tertiary" style={{ marginBottom: 12 }}>Skip today</p>
            <div className="flex-col gap-2">
              {result.avoid_list.map((item, i) => (
                <div key={i} className={`card ${styles.avoidItem}`}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <p className="text-body" style={{ fontWeight: 600 }}>{item.dish_name}</p>
                      <p className="text-caption text-secondary" style={{ marginTop: 2 }}>{item.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log CTA */}
        <div className={styles.logCta}>
          <p className="text-body text-secondary text-center">Going with the top pick?</p>
          <button className="btn btn-primary w-full" style={{ marginTop: 12 }}>
            ✅ Log {result.recommendations[0]?.dish_name || "this meal"}
          </button>
          <Link href="/scan" className="btn btn-ghost w-full" style={{ marginTop: 8, justifyContent: "center" }}>
            Scan another menu
          </Link>
        </div>

      </main>
    </>
  );
}
