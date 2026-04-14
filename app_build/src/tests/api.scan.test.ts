/**
 * Unit tests: API Route — /api/v1/scan
 * Tests: input validation, missing API key, image size limit, JSON error handling
 */

// ── Helpers ────────────────────────────────────────────────────────────────

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/v1/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/v1/scan — input validation", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, GEMINI_API_KEY: "test-key" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("returns 400 when image_base64 is missing", async () => {
    // Dynamic import so env is set first
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({ budget_inr: 200 });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("BAD_REQUEST");
  });

  test("returns 400 when body is not valid JSON", async () => {
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = new Request("http://localhost/api/v1/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json!!!",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  test("returns 413 when image_base64 exceeds 5.5MB limit", async () => {
    const { POST } = await import("@/app/api/v1/scan/route");
    const bigImage = "A".repeat(5_600_000);
    const req = makeRequest({ image_base64: bigImage });
    const res = await POST(req as never);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  test("returns 500 when GEMINI_API_KEY is not set", async () => {
    // Temporarily remove the key
    const key = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    // Re-import to get fresh module without cached key
    jest.resetModules();
    const { POST } = await import("@/app/api/v1/scan/route");
    const req = makeRequest({ image_base64: "dGVzdA==" });
    const res = await POST(req as never);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error.code).toBe("CONFIG_ERROR");

    // Restore
    process.env.GEMINI_API_KEY = key;
  });
});

// ── Unit tests: utility functions ──────────────────────────────────────────

describe("Greeting logic", () => {
  const getGreeting = (hour: number) => {
    if (hour < 12) return { text: "Good morning", emoji: "🌅" };
    if (hour < 17) return { text: "Good afternoon", emoji: "☀️" };
    return { text: "Good evening", emoji: "🌙" };
  };

  test("returns morning for hour < 12", () => {
    expect(getGreeting(9).text).toBe("Good morning");
  });

  test("returns afternoon for hour 12-16", () => {
    expect(getGreeting(14).text).toBe("Good afternoon");
  });

  test("returns evening for hour >= 17", () => {
    expect(getGreeting(20).text).toBe("Good evening");
    expect(getGreeting(20).emoji).toBe("🌙");
  });
});

// ── Unit tests: scan result helpers ───────────────────────────────────────

describe("Score classification", () => {
  const scoreClass = (score: number) => {
    if (score >= 80) return "score-badge-high";
    if (score >= 60) return "score-badge-mid";
    return "score-badge-low";
  };

  test("returns high class for score >= 80", () => {
    expect(scoreClass(85)).toBe("score-badge-high");
    expect(scoreClass(80)).toBe("score-badge-high");
  });

  test("returns mid class for score 60-79", () => {
    expect(scoreClass(70)).toBe("score-badge-mid");
    expect(scoreClass(60)).toBe("score-badge-mid");
  });

  test("returns low class for score < 60", () => {
    expect(scoreClass(40)).toBe("score-badge-low");
    expect(scoreClass(0)).toBe("score-badge-low");
  });
});

describe("Rank emoji", () => {
  const rankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    return "🥉";
  };

  test("gold for rank 1", () => expect(rankEmoji(1)).toBe("🥇"));
  test("silver for rank 2", () => expect(rankEmoji(2)).toBe("🥈"));
  test("bronze for rank 3+", () => expect(rankEmoji(3)).toBe("🥉"));
});
