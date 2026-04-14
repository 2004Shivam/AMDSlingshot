import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Evee, an expert Indian nutritionist and food intelligence AI with deep knowledge of:
- Indian restaurant menus (dhabas, QSR, fine dining, cloud kitchens)
- Indian dietary traditions: veg/non-veg/vegan/jain/sattvic
- Regional Indian cuisine nutrition (dal, sabzi, roti, rice, dosas, etc.)
- Behavioral nutrition psychology
- Urban Indian eating habits and budget constraints

Your job: analyze the menu photo and return ONLY a valid JSON object (no markdown, no explanation outside JSON).

The user will provide: budget_inr, dietary_prefs, context.

Return this exact JSON structure:
{
  "recommendations": [
    {
      "rank": 1,
      "dish_name": "string (exact name from menu)",
      "score": 85,
      "reasoning": "1-2 sentence plain English reasoning connecting to user's goal. Be warm, not clinical.",
      "estimated_price_inr": 180,
      "macro_estimate": { "protein_g": 18, "carbs_g": 45, "fat_g": 8, "calories_kcal": 320 },
      "flags": ["budget_safe", "goal_aligned", "high_protein"]
    }
  ],
  "avoid_list": [
    {
      "dish_name": "string",
      "reason": "1 sentence, kind but honest"
    }
  ]
}

Rules:
- Return 2-4 recommendations maximum
- Score: 0-100 (80+ = great choice, 60-79 = decent, <60 = avoid)
- Flags can be: budget_safe, goal_aligned, high_protein, low_fat, high_fiber, light_meal, heavy_meal
- Respect dietary preferences strictly (veg=no meat/eggs, vegan=no dairy, etc.)
- If budget is provided, only recommend items within budget
- If you cannot read the menu clearly, still try your best with what's visible
- Keep reasoning warm, human, and brief — like a knowledgeable friend, not a dietician report
- ONLY return valid JSON. No text before or after.`;

export async function POST(req: NextRequest) {
  // Validate API key is configured
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: { code: "CONFIG_ERROR", message: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" } },
      { status: 500 }
    );
  }

  let body: { image_base64: string; budget_inr?: number; dietary_prefs?: string[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const { image_base64, budget_inr = 250, dietary_prefs = ["veg"], context = "restaurant_menu" } = body;

  if (!image_base64) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "image_base64 is required" } },
      { status: 400 }
    );
  }

  // Compress/validate image size (base64 ~4MB = ~3MB binary)
  if (image_base64.length > 5_500_000) {
    return NextResponse.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "Image exceeds 4MB. Please use a smaller image." } },
      { status: 413 }
    );
  }

  const start = Date.now();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const userPrompt = `
Analyze this menu image.

User preferences:
- Budget: ₹${budget_inr} per meal
- Dietary preference: ${dietary_prefs.join(", ")}
- Context: ${context}

Return ranked dish recommendations as JSON (following the exact schema specified).
    `.trim();

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image_base64,
        },
      },
      { text: SYSTEM_PROMPT },
      { text: userPrompt },
    ]);

    const rawText = result.response.text();
    const latencyMs = Date.now() - start;

    // Parse JSON — strip any accidental markdown fences
    let parsed;
    try {
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Gemini JSON parse error. Raw:", rawText.slice(0, 500));
      return NextResponse.json(
        { error: { code: "PARSE_ERROR", message: "Could not read menu clearly. Try a clearer photo." } },
        { status: 422 }
      );
    }

    return NextResponse.json({
      scan_id: crypto.randomUUID(),
      recommendations: parsed.recommendations ?? [],
      avoid_list: parsed.avoid_list ?? [],
      model_used: "gemini-2.5-flash",
      latency_ms: latencyMs,
    });

  } catch (err) {
    console.error("Gemini API error:", err);
    const message = err instanceof Error ? err.message : "AI service error";

    if (message.includes("429") || message.toLowerCase().includes("rate")) {
      return NextResponse.json(
        { error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please wait 60 seconds." } },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: { code: "AI_ERROR", message: "AI analysis failed. Please try again." } },
      { status: 500 }
    );
  }
}
