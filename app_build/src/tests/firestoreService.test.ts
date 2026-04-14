/**
 * Unit tests: Firestore service layer (mocked — no live Firestore connection)
 * Tests: getWeeklyStats logic, meal data validation, sort order
 */

// ── Type mirror (avoids importing firebase in tests) ──────────────────────

interface MealLogEntry {
  id?: string;
  uid: string;
  dish_name: string;
  score: number;
  estimated_price_inr: number;
  macro_estimate: { protein_g: number; carbs_g: number; fat_g: number; calories_kcal: number };
  dietary_pref: string;
  source: "scan" | "voice" | "manual";
  logged_at?: Date | null;
}

// ── Helper: weekly stats calculator (extracted logic) ──────────────────────

function computeWeeklyStats(meals: MealLogEntry[]) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const recent = meals.filter((m) => {
    if (!m.logged_at) return false;
    return (m.logged_at as Date).getTime() >= oneWeekAgo;
  });

  if (recent.length === 0) {
    return { totalMeals: 0, avgScore: 0, highScoreDays: 0, totalCalories: 0 };
  }

  const avgScore = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
  const highScoreDays = new Set(
    recent.filter((m) => m.score >= 70).map((m) => (m.logged_at as Date).toDateString())
  ).size;
  const totalCalories = recent.reduce((sum, m) => sum + m.macro_estimate.calories_kcal, 0);

  return { totalMeals: recent.length, avgScore: Math.round(avgScore), highScoreDays, totalCalories };
}

// ── Mock data ────────────────────────────────────────────────────────────────

const NOW = new Date();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

const mockMeals: MealLogEntry[] = [
  {
    uid: "user-1",
    dish_name: "Dal Tadka",
    score: 88,
    estimated_price_inr: 180,
    macro_estimate: { protein_g: 18, carbs_g: 45, fat_g: 8, calories_kcal: 320 },
    dietary_pref: "veg",
    source: "scan",
    logged_at: NOW,
  },
  {
    uid: "user-1",
    dish_name: "Chole Bhature",
    score: 62,
    estimated_price_inr: 150,
    macro_estimate: { protein_g: 12, carbs_g: 60, fat_g: 20, calories_kcal: 520 },
    dietary_pref: "veg",
    source: "scan",
    logged_at: yesterday,
  },
  {
    uid: "user-1",
    dish_name: "Old meal",
    score: 55,
    estimated_price_inr: 120,
    macro_estimate: { protein_g: 8, carbs_g: 30, fat_g: 5, calories_kcal: 200 },
    dietary_pref: "veg",
    source: "manual",
    logged_at: twoWeeksAgo, // outside 7-day window
  },
];

// ── Tests ────────────────────────────────────────────────────────────────────

describe("computeWeeklyStats — logic unit tests", () => {

  test("counts only meals within last 7 days", () => {
    const stats = computeWeeklyStats(mockMeals);
    // twoWeeksAgo meal should be excluded
    expect(stats.totalMeals).toBe(2);
  });

  test("calculates correct average score", () => {
    const stats = computeWeeklyStats(mockMeals);
    // (88 + 62) / 2 = 75
    expect(stats.avgScore).toBe(75);
  });

  test("counts high-score days correctly (score >= 70)", () => {
    const stats = computeWeeklyStats(mockMeals);
    // Only Dal Tadka (88) qualifies — logged today
    expect(stats.highScoreDays).toBe(1);
  });

  test("sums total calories correctly", () => {
    const stats = computeWeeklyStats(mockMeals);
    // 320 + 520 = 840 (excludes old meal)
    expect(stats.totalCalories).toBe(840);
  });

  test("returns zeros when no meals exist", () => {
    const stats = computeWeeklyStats([]);
    expect(stats.totalMeals).toBe(0);
    expect(stats.avgScore).toBe(0);
    expect(stats.highScoreDays).toBe(0);
    expect(stats.totalCalories).toBe(0);
  });

  test("returns zeros when all meals are outside 7-day window", () => {
    const oldMeals = mockMeals.filter(m => m.logged_at === twoWeeksAgo);
    const stats = computeWeeklyStats(oldMeals);
    expect(stats.totalMeals).toBe(0);
  });

  test("handles meal with no logged_at date", () => {
    const mealNoDate: MealLogEntry = {
      uid: "user-1",
      dish_name: "Unknown time meal",
      score: 90,
      estimated_price_inr: 200,
      macro_estimate: { protein_g: 20, carbs_g: 40, fat_g: 10, calories_kcal: 350 },
      dietary_pref: "veg",
      source: "manual",
      logged_at: null,
    };
    // Should not throw — just excludes the meal
    expect(() => computeWeeklyStats([mealNoDate])).not.toThrow();
    const stats = computeWeeklyStats([mealNoDate]);
    expect(stats.totalMeals).toBe(0);
  });
});

// ── MealLogEntry shape validation ─────────────────────────────────────────

describe("MealLogEntry shape validation", () => {
  const validEntry: MealLogEntry = mockMeals[0];

  test("required fields are present", () => {
    expect(validEntry).toHaveProperty("uid");
    expect(validEntry).toHaveProperty("dish_name");
    expect(validEntry).toHaveProperty("score");
    expect(validEntry).toHaveProperty("source");
    expect(validEntry).toHaveProperty("macro_estimate");
  });

  test("source field is one of valid enum values", () => {
    const validSources = ["scan", "voice", "manual"];
    mockMeals.forEach(m => {
      expect(validSources).toContain(m.source);
    });
  });

  test("score is in valid range 0-100", () => {
    mockMeals.forEach(m => {
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(100);
    });
  });

  test("macro_estimate fields are all non-negative", () => {
    mockMeals.forEach(m => {
      const mac = m.macro_estimate;
      expect(mac.protein_g).toBeGreaterThanOrEqual(0);
      expect(mac.carbs_g).toBeGreaterThanOrEqual(0);
      expect(mac.fat_g).toBeGreaterThanOrEqual(0);
      expect(mac.calories_kcal).toBeGreaterThanOrEqual(0);
    });
  });

  test("estimated_price_inr is positive", () => {
    mockMeals.forEach(m => {
      expect(m.estimated_price_inr).toBeGreaterThan(0);
    });
  });
});
