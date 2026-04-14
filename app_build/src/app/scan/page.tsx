"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./scan.module.css";

type ScanState = "idle" | "camera" | "preview" | "analyzing" | "done";

export default function ScanPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [budget, setBudget] = useState("250");
  const [diet, setDiet] = useState("veg");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB. We'll compress it automatically.");
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setState("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!preview) return;
    setState("analyzing");
    setError(null);

    try {
      // Convert base64 image (strip data URL prefix)
      const base64 = preview.split(",")[1];

      const res = await fetch("/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: base64,
          budget_inr: parseInt(budget) || 250,
          dietary_prefs: [diet],
          context: "restaurant_menu",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Analysis failed. Please try again.");
      }

      const data = await res.json();
      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("evee_scan_result", JSON.stringify(data));
      sessionStorage.setItem("evee_scan_preview", preview);
      router.push("/scan/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("preview");
    }
  };

  const reset = () => {
    setState("idle");
    setPreview(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <Link href="/" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
          ← Back
        </Link>
        <span className="text-title">Scan Menu</span>
        <div style={{ width: 64 }} />
      </header>

      <main className="page-content">

        {/* State: Idle — Upload prompt */}
        {(state === "idle" || state === "preview") && (
          <>
            {/* Upload Zone */}
            <div
              className={`${styles.uploadZone} ${preview ? styles.hasPreview : ""}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !preview && fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Menu preview" className={styles.previewImage} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p className="text-title" style={{ marginTop: 16 }}>Point at a menu</p>
                  <p className="text-body text-secondary" style={{ marginTop: 8 }}>
                    Tap to take a photo or upload from gallery
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 24 }}
                    onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  >
                    📷 Open Camera / Gallery
                  </button>
                  <p className="text-caption text-tertiary" style={{ marginTop: 12 }}>
                    Supports any menu — restaurant board, printed card, app screenshot
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />

            {/* Filters */}
            <div className={`card ${styles.filters}`}>
              <p className="text-label text-tertiary" style={{ marginBottom: 16 }}>Personalize this scan</p>

              <div className={styles.filterRow}>
                <label className="text-body" style={{ fontWeight: 600, flexShrink: 0 }}>
                  💰 Budget (₹)
                </label>
                <input
                  className="input"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="250"
                  min="50"
                  max="2000"
                  style={{ maxWidth: 120 }}
                />
              </div>

              <div className={styles.filterRow} style={{ marginTop: 12 }}>
                <label className="text-body" style={{ fontWeight: 600 }}>🌿 Diet</label>
                <div className={styles.dietChips}>
                  {["veg", "non_veg", "vegan", "eggetarian"].map((d) => (
                    <button
                      key={d}
                      className={`chip ${diet === d ? "chip-ember" : ""}`}
                      style={diet !== d ? { background: "var(--bg-surface-high)", color: "var(--text-secondary)", border: "1px solid var(--border)" } : {}}
                      onClick={() => setDiet(d)}
                    >
                      {d === "veg" ? "🟢 Veg" : d === "non_veg" ? "🔴 Non-veg" : d === "vegan" ? "🌱 Vegan" : "🥚 Eggetarian"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className={styles.errorBanner}>
                ⚠️ {error}
              </div>
            )}

            {/* Analyze CTA */}
            {preview && (
              <div className={styles.analyzeRow}>
                <button className="btn btn-secondary" onClick={reset} style={{ flex: 1 }}>
                  🔄 Retake
                </button>
                <button
                  className="btn btn-primary"
                  onClick={analyze}
                  style={{ flex: 2, boxShadow: "var(--shadow-ember)" }}
                >
                  ✨ Analyze Menu
                </button>
              </div>
            )}
          </>
        )}

        {/* State: Analyzing */}
        {state === "analyzing" && (
          <div className={styles.analyzingState}>
            <div className={`${styles.aiOrb} pulse-ember`}>✨</div>
            <h2 className="text-headline" style={{ marginTop: 24 }}>Analyzing your menu...</h2>
            <p className="text-body text-secondary" style={{ marginTop: 8, textAlign: "center" }}>
              Gemini is reading the menu, cross-referencing<br />
              your goals, and ranking your best options
            </p>

            {/* Progress steps */}
            <div className={styles.progressSteps}>
              {[
                "Reading menu items...",
                "Estimating nutrition...",
                "Matching your goals...",
                "Ranking recommendations...",
              ].map((step, i) => (
                <div key={i} className={styles.stepItem} style={{ animationDelay: `${i * 0.8}s` }}>
                  <div className={styles.stepDot} />
                  <span className="text-body text-secondary">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
