"use client";

import Link from "next/link";
import styles from "./home.module.css";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
};

export default function HomePage() {
  const { text, emoji } = greeting();

  return (
    <>
      {/* ── Header ── */}
      <header className="app-header">
        <span className="logo">evee</span>
        <div className="flex items-center gap-3">
          <Link href="/history" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
            📋
          </Link>
          <div className={styles.avatar}>R</div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="page-content">

        {/* Greeting */}
        <div className={styles.greeting}>
          <p className="text-caption text-secondary">{emoji} {text}</p>
          <h1 className="text-display" style={{ marginTop: 4 }}>
            What are you<br />
            <span className="text-ember">eating next?</span>
          </h1>
        </div>

        {/* Active Nudge Banner */}
        <div className={`nudge-banner ${styles.nudgeBanner}`}>
          <div className={styles.nudgeIcon}>🍱</div>
          <div className="flex-col gap-2" style={{ flex: 1 }}>
            <p className="text-body-lg" style={{ fontWeight: 600 }}>Lunch in ~30 min?</p>
            <p className="text-body text-secondary">
              Scan the menu before you order — your past choices suggest you tend to overshoot on Mondays.
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className={styles.actionSection}>
          <p className="text-label text-tertiary" style={{ marginBottom: 16 }}>Quick actions</p>
          
          <div className={styles.fabRow}>
            {/* Scan Menu FAB */}
            <Link href="/scan" className={styles.fabCard}>
              <div className="fab fab-primary pulse-ember">📷</div>
              <div className="flex-col gap-1" style={{ marginTop: 12 }}>
                <p className="text-title">Scan Menu</p>
                <p className="text-body text-secondary">Point camera at any menu for instant AI recommendations</p>
              </div>
              <div className={`chip chip-ember ${styles.fabChip}`}>Most popular</div>
            </Link>

            {/* Log Voice FAB */}
            <Link href="/log" className={styles.fabCard}>
              <div className="fab fab-secondary">🎙️</div>
              <div className="flex-col gap-1" style={{ marginTop: 12 }}>
                <p className="text-title">Log by Voice</p>
                <p className="text-body text-secondary">Say what you ate in Hindi or English — done in 3 seconds</p>
              </div>
              <div className={`chip chip-indigo ${styles.fabChip}`}>Phase 2</div>
            </Link>
          </div>
        </div>

        {/* Today's Summary */}
        <div className={styles.summarySection}>
          <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
            <p className="text-title">Today&apos;s Meals</p>
            <Link href="/history" className="text-body text-ember" style={{ textDecoration: "none" }}>
              See all →
            </Link>
          </div>

          {/* Empty state */}
          <div className={`card ${styles.emptyState}`}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p className="text-body-lg" style={{ fontWeight: 600 }}>No meals logged today</p>
            <p className="text-body text-secondary" style={{ marginTop: 6 }}>
              Scan a menu or log a meal to see your food story unfold
            </p>
          </div>
        </div>

        {/* Weekly Insight Teaser */}
        <div className={`card card-indigo ${styles.insightTeaser}`}>
          <div className="flex justify-between items-center">
            <div className="flex-col gap-2">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-label text-indigo">This week&apos;s story</span>
              </div>
              <p className="text-body-lg" style={{ fontWeight: 600 }}>
                You ate great 4 out of 7 days
              </p>
              <p className="text-body text-secondary">Tap to see full breakdown</p>
            </div>
            <Link href="/insights" className="btn btn-ghost" style={{ flexShrink: 0 }}>
              →
            </Link>
          </div>
        </div>

      </main>
    </>
  );
}
