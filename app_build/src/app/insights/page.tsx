"use client";

import Link from "next/link";
import styles from "./insights.module.css";

const insights = {
  top_win: "You hit your protein goal 5 out of 7 days this week 💪",
  pattern_found: "You tend to order heavy on Thursday evenings — likely after late meetings.",
  next_week_goal: "Add one salad or sabzi per day to hit your fiber target.",
  meal_count: 19,
  avg_daily_calories: 1820,
  goal_alignment_avg_pct: 74,
};

export default function InsightsPage() {
  return (
    <>
      <header className="app-header">
        <Link href="/" className="btn btn-ghost" style={{ padding: "8px 12px" }}>← Home</Link>
        <span className="text-title">Food Story</span>
        <div style={{ width: 64 }} />
      </header>

      <main className="page-content">

        <div className={styles.weekLabel}>
          <span className="text-label text-tertiary">APR 7 – APR 13, 2026</span>
          <span className="chip chip-indigo">Weekly Report</span>
        </div>

        {/* Score header */}
        <div className={`card ${styles.scoreCard}`}>
          <div className={styles.scoreRing}>
            <svg viewBox="0 0 100 100" className={styles.ringsvg}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ember)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.74} ${2 * Math.PI * 40 * 0.26}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className={styles.scoreCenter}>
              <span className="text-display text-ember">{insights.goal_alignment_avg_pct}</span>
              <span className="text-caption text-secondary">/ 100</span>
            </div>
          </div>
          <div className="flex-col gap-1" style={{ flex: 1 }}>
            <p className="text-title">Alignment Score</p>
            <p className="text-body text-secondary">
              You logged {insights.meal_count} meals averaging {insights.avg_daily_calories} kcal/day
            </p>
            <div className="chip chip-gold" style={{ width: "fit-content", marginTop: 8 }}>
              ✨ Good week!
            </div>
          </div>
        </div>

        {/* Top Win */}
        <div className={`card card-ember ${styles.insightCard}`}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <span className={styles.insightEmoji}>🏆</span>
            <span className="text-label text-ember">Top Win</span>
          </div>
          <p className="text-body-lg" style={{ fontWeight: 600 }}>{insights.top_win}</p>
        </div>

        {/* Pattern Found */}
        <div className={`card card-indigo ${styles.insightCard}`}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <span className={styles.insightEmoji}>🔍</span>
            <span className="text-label text-indigo">Pattern Found</span>
          </div>
          <p className="text-body-lg" style={{ fontWeight: 600 }}>{insights.pattern_found}</p>
        </div>

        {/* Next Week Goal */}
        <div className={`card ${styles.insightCard}`} style={{ borderColor: "var(--border-indigo)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <span className={styles.insightEmoji}>🎯</span>
            <span className="text-label" style={{ color: "var(--gold)" }}>Next Week&apos;s Mission</span>
          </div>
          <p className="text-body-lg" style={{ fontWeight: 600 }}>{insights.next_week_goal}</p>
        </div>

        {/* Day-by-day mini bars */}
        <div className="card" style={{ marginTop: 8 }}>
          <p className="text-title" style={{ marginBottom: 16 }}>Daily Alignment</p>
          <div className={styles.dayBars}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => {
              const scores = [82, 74, 90, 55, 78, 88, 62];
              const s = scores[i];
              const cls = s >= 80 ? "var(--success)" : s >= 65 ? "var(--gold)" : "var(--ember)";
              return (
                <div key={day} className={styles.dayBar}>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ height: `${s}%`, background: cls }} />
                  </div>
                  <span className="text-caption text-tertiary">{day}</span>
                  <span className="text-caption" style={{ color: cls, fontWeight: 600 }}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.scanCta}>
          <Link href="/scan" className="btn btn-primary w-full">
            📷 Scan Today&apos;s Menu
          </Link>
        </div>

      </main>
    </>
  );
}
