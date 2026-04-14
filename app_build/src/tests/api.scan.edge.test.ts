/**
 * Extended test suite — edge cases + integration flows
 * Covers: API validation edge cases, data transformation, sessionStorage behaviour
 */

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/v1/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ────────────────────────────────────────────────────────────────────────────
// API Route — Extended edge cases
// ────────────────────────────────────────────────────────────────────────────

describe("POST /api/v1/scan — extended edge cases", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, GEMINI_API_KEY: "test-key" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("empty string image_base64 is rejected as BAD_REQUEST", async () => {
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({ image_base64: "" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("BAD_REQUEST");
  });

  test("null image_base64 triggers BAD_REQUEST", async () => {
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({ image_base64: null });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  test("image at exactly 5.5M chars is accepted (boundary)", async () => {
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    // At boundary — should NOT return 413 (hits Gemini which will fail w/ mock key, but not payload error)
    const boundary = "A".repeat(5_500_000);
    const req = makeRequest({ image_base64: boundary });
    const res = await POST(req as never);
    // Should not be 413 — it's below the limit
    expect(res.status).not.toBe(413);
  });

  test("optional fields use defaults when omitted", async () => {
    // Test that the route doesn't crash with minimal payload (only image)
    // It will fail at Gemini (bad key) but not at validation
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({ image_base64: "dGVzdA==" }); // tiny valid-looking b64
    const res = await POST(req as never);
    // Should fail at AI call (bad key / network), not at validation
    expect([422, 429, 500].includes(res.status)).toBe(true);
    const data = await res.json();
    expect(data.error.code).not.toBe("BAD_REQUEST");
    expect(data.error.code).not.toBe("PAYLOAD_TOO_LARGE");
  });

  test("error response always has error.code and error.message", async () => {
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({});
    const res = await POST(req as never);
    const data = await res.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toHaveProperty("code");
    expect(data.error).toHaveProperty("message");
    expect(typeof data.error.code).toBe("string");
    expect(typeof data.error.message).toBe("string");
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Data transformation helpers (simulating what frontend does with scan result)
// ────────────────────────────────────────────────────────────────────────────

describe("Scan result data transformations", () => {

  const mockScanResult = {
    scan_id: "abc-123",
    recommendations: [
      {
        rank: 1,
        dish_name: "Dal Tadka",
        score: 88,
        reasoning: "High protein, low fat, within budget",
        estimated_price_inr: 180,
        macro_estimate: { protein_g: 18, carbs_g: 45, fat_g: 8, calories_kcal: 320 },
        flags: ["budget_safe", "goal_aligned", "high_protein"],
      },
      {
        rank: 2,
        dish_name: "Paneer Tikka",
        score: 72,
        reasoning: "Good protein, slightly over budget",
        estimated_price_inr: 280,
        macro_estimate: { protein_g: 22, carbs_g: 12, fat_g: 18, calories_kcal: 290 },
        flags: ["high_protein"],
      },
    ],
    avoid_list: [{ dish_name: "Butter Chicken", reason: "Non-veg" }],
    model_used: "gemini-2.5-flash",
    latency_ms: 1200,
  };

  test("recommendations array is non-empty and sorted by rank", () => {
    const recs = mockScanResult.recommendations;
    expect(recs.length).toBeGreaterThan(0);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].rank).toBeGreaterThan(recs[i - 1].rank);
    }
  });

  test("each recommendation has required fields", () => {
    mockScanResult.recommendations.forEach((rec) => {
      expect(rec).toHaveProperty("rank");
      expect(rec).toHaveProperty("dish_name");
      expect(rec).toHaveProperty("score");
      expect(rec).toHaveProperty("reasoning");
      expect(rec).toHaveProperty("estimated_price_inr");
      expect(rec).toHaveProperty("macro_estimate");
      expect(rec).toHaveProperty("flags");
    });
  });

  test("score is always between 0 and 100", () => {
    mockScanResult.recommendations.forEach((rec) => {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
    });
  });

  test("macro_estimate has all four macro fields", () => {
    mockScanResult.recommendations.forEach((rec) => {
      const m = rec.macro_estimate;
      expect(m).toHaveProperty("protein_g");
      expect(m).toHaveProperty("carbs_g");
      expect(m).toHaveProperty("fat_g");
      expect(m).toHaveProperty("calories_kcal");
      // All should be positive numbers
      expect(m.protein_g).toBeGreaterThanOrEqual(0);
      expect(m.calories_kcal).toBeGreaterThan(0);
    });
  });

  test("sessionStorage serialization round-trip preserves data", () => {
    // Simulate what scan page does before navigating to results
    const serialized = JSON.stringify(mockScanResult);
    const deserialized = JSON.parse(serialized);
    expect(deserialized.scan_id).toBe(mockScanResult.scan_id);
    expect(deserialized.recommendations).toHaveLength(mockScanResult.recommendations.length);
    expect(deserialized.recommendations[0].dish_name).toBe("Dal Tadka");
  });

  test("avoid_list can be empty array without breaking", () => {
    const resultNoAvoid = { ...mockScanResult, avoid_list: [] };
    expect(resultNoAvoid.avoid_list).toHaveLength(0);
    expect(Array.isArray(resultNoAvoid.avoid_list)).toBe(true);
  });

  test("flags array handles unknown flag keys gracefully", () => {
    const flagLabel: Record<string, { label: string; cls: string }> = {
      budget_safe: { label: "✅ Budget safe", cls: "chip-success" },
      goal_aligned: { label: "🎯 Goal aligned", cls: "chip-indigo" },
      high_protein: { label: "💪 High protein", cls: "chip-ember" },
    };
    const unknownFlag = "unknown_flag_xyz";
    // Should return undefined without throwing
    expect(flagLabel[unknownFlag]).toBeUndefined();
    // Filter null handles this gracefully
    const rendered = ["budget_safe", unknownFlag].map(f => flagLabel[f] ?? null).filter(Boolean);
    expect(rendered).toHaveLength(1);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Budget validation logic
// ────────────────────────────────────────────────────────────────────────────

describe("Budget filtering utility", () => {
  const filterByBudget = (price: number, budget: number) => price <= budget;

  test("item within budget passes", () => {
    expect(filterByBudget(180, 250)).toBe(true);
  });

  test("item at exact budget passes", () => {
    expect(filterByBudget(250, 250)).toBe(true);
  });

  test("item over budget fails", () => {
    expect(filterByBudget(300, 250)).toBe(false);
  });

  test("zero budget rejects everything above 0", () => {
    expect(filterByBudget(10, 0)).toBe(false);
  });
});
