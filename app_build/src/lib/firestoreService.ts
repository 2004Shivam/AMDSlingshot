/**
 * Firestore meal log service
 * Saves scanned meals + manual logs to Firestore for history & insights
 */
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db, ensureAnonymousAuth } from "./firebase";

// ── Types ────────────────────────────────────────────────────────────────────

export interface MealLogEntry {
  id?: string;
  uid: string;
  dish_name: string;
  score: number;
  estimated_price_inr: number;
  macro_estimate: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    calories_kcal: number;
  };
  dietary_pref: string;
  scan_id?: string;
  logged_at?: Timestamp | Date;
  source: "scan" | "voice" | "manual";
}

export interface ScanHistoryEntry {
  id?: string;
  uid: string;
  scan_id: string;
  recommendations_count: number;
  model_used: string;
  latency_ms: number;
  scanned_at?: Timestamp | Date;
}

// ── Meal Logging ─────────────────────────────────────────────────────────────

/**
 * Log a meal chosen from the scan results to Firestore.
 * Signs in anonymously if no auth session exists.
 */
export async function logMeal(entry: Omit<MealLogEntry, "uid" | "logged_at">): Promise<string | null> {
  try {
    const uid = await ensureAnonymousAuth();
    if (!uid) throw new Error("Could not authenticate");

    const docRef = await addDoc(collection(db, "meal_logs"), {
      ...entry,
      uid,
      logged_at: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error("[Firestore] logMeal error:", err);
    return null;
  }
}

/**
 * Get the last N meal logs for the current device user.
 */
export async function getRecentMeals(limitCount = 20): Promise<MealLogEntry[]> {
  try {
    const uid = await ensureAnonymousAuth();
    if (!uid) return [];

    const q = query(
      collection(db, "meal_logs"),
      orderBy("logged_at", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as MealLogEntry))
      .filter((entry) => entry.uid === uid); // client-side uid filter for anon auth
  } catch (err) {
    console.error("[Firestore] getRecentMeals error:", err);
    return [];
  }
}

// ── Scan History ─────────────────────────────────────────────────────────────

/**
 * Record that a scan happened (metadata only — no image stored).
 */
export async function recordScan(entry: Omit<ScanHistoryEntry, "uid" | "scanned_at">): Promise<void> {
  try {
    const uid = await ensureAnonymousAuth();
    if (!uid) return;

    await addDoc(collection(db, "scan_history"), {
      ...entry,
      uid,
      scanned_at: serverTimestamp(),
    });
  } catch (err) {
    console.error("[Firestore] recordScan error:", err);
  }
}

// ── Weekly Stats ─────────────────────────────────────────────────────────────

export interface WeeklyStats {
  totalMeals: number;
  avgScore: number;
  highScoreDays: number;
  totalCalories: number;
}

/**
 * Compute weekly stats from Firestore meal logs.
 */
export async function getWeeklyStats(): Promise<WeeklyStats> {
  const meals = await getRecentMeals(50);
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const recent = meals.filter((m) => {
    if (!m.logged_at) return false;
    const ts = m.logged_at instanceof Date
      ? m.logged_at.getTime()
      : (m.logged_at as Timestamp).toMillis?.() ?? 0;
    return ts >= oneWeekAgo;
  });

  if (recent.length === 0) {
    return { totalMeals: 0, avgScore: 0, highScoreDays: 0, totalCalories: 0 };
  }

  const avgScore = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
  const highScoreDays = new Set(
    recent
      .filter((m) => m.score >= 70)
      .map((m) => {
        const ts = m.logged_at instanceof Date
          ? m.logged_at
          : new Date((m.logged_at as Timestamp).toMillis?.() ?? 0);
        return ts.toDateString();
      })
  ).size;
  const totalCalories = recent.reduce((sum, m) => sum + (m.macro_estimate?.calories_kcal ?? 0), 0);

  return { totalMeals: recent.length, avgScore: Math.round(avgScore), highScoreDays, totalCalories };
}
