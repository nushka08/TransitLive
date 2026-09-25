import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import sql from '@/lib/db';

function cleanAndParseJSON(text: string) {
  // Strip markdown backticks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Extract the JSON object boundaries in case of trailing chatter
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  try {
    const { destination, days, budget, companion, transitMode } = await req.json();

    if (!destination || !days) {
      return NextResponse.json({ error: 'Destination and days are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not defined in .env' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Create a structured ${days}-day public transit itinerary for ${destination}.
      Budget: ${budget || 'Moderate'}.
      Transit Focus: ${transitMode || 'Public Metro & Bus'}.

      Return ONLY valid JSON matching this schema with no markdown, backticks, or extra explanation:
      {
        "tripTitle": "${days}-Day ${destination} Transit Guide",
        "overview": "Summary of the trip",
        "dailyPlan": [
          {
            "day": 1,
            "theme": "Theme of the day",
            "activities": [
              {
                "time": "Morning",
                "place": "Name of location",
                "description": "Short description",
                "transitInfo": "Exact bus/metro lines or stops to take"
              }
            ]
          }
        ],
        "transitTips": ["Tip 1", "Tip 2"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const itineraryData = cleanAndParseJSON(rawText);

    // Save directly to Neon PostgreSQL over HTTPS
    const [savedTrip] = await sql`
      INSERT INTO trips (destination, days, budget, companion, transit_mode, itinerary_data)
      VALUES (${destination}, ${parseInt(days)}, ${budget || 'Moderate'}, ${companion || 'Solo'}, ${transitMode || 'Public Transit'}, ${JSON.stringify(itineraryData)})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      trip: {
        id: savedTrip.id,
        itineraryData: savedTrip.itinerary_data,
      },
    });
  } catch (error: any) {
    console.error('Error generating trip:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}