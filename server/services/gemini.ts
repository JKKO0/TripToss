import { TripPrompt, TripItinerary } from "@shared/schema";
import 'dotenv/config';

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function generateTripItinerary(tripPrompt: TripPrompt): Promise<TripItinerary> {
  try {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const prompt = createPrompt(tripPrompt);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    return parseGeminiResponse(textResponse);
  } catch (error) {
    console.error("Error generating trip itinerary:", error);
    throw error;
  }
}

function createPrompt(tripPrompt: TripPrompt): string {
  const accommodationInfo = tripPrompt.accommodation 
    ? `\nThe traveler will be staying at: ${tripPrompt.accommodation}. At the end of each day's activities, include directions for getting back to this accommodation. Include a Google Maps directions link using this format: https://www.google.com/maps/dir/?api=1&destination=${tripPrompt.accommodation.replace(/\s+/g, '+')}. Also include a tip about the best transportation method for returning.` 
    : '';

  return `
  Create a detailed travel itinerary for a trip to ${tripPrompt.destination} for a duration of ${tripPrompt.duration}.
  The budget is ${tripPrompt.budget} and the traveler is interested in: ${tripPrompt.interests.join(', ')}.${accommodationInfo}

  Please format the response in JSON with the following structure:
  {
    "summary": "A brief summary of the trip",
    "days": [
      {
        "day": 1,
        "title": "Day title",
        "activities": [
          {
            "time": "9:00 AM",
            "title": "Activity title",
            "description": "Activity description",
            "googleMapsLink": "Google Maps Link"
          },
          {
            "time": "End of day",
            "title": "Return to accommodation",
            "description": "Directions back to the accommodation including transport tips",
            "googleMapsLink": "Google Maps Link"
          }
        ]
      }
    ],
    "tips": ["Tip 1", "Tip 2"]
  }

  ✅ For each activity, include a Google Maps link using this format:
  "https://www.google.com/maps/search/?q=<Place Name or Activity>". Use place names with "+" instead of spaces.
  ✅ For return-to-accommodation links, use:
  "https://www.google.com/maps/dir/?api=1&destination=<Accommodation+Name>".

  Make sure the output strictly follows the JSON structure. Include 3–5 practical travel tips, focus on the interests and budget, and ensure the itinerary is locally authentic and feasible.
  `;
}


function parseGeminiResponse(text: string): TripItinerary {
  try {
    // Find the JSON part of the response (in case there's additional text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not parse JSON response");
    }

    const jsonText = jsonMatch[0];
    const parsedResponse = JSON.parse(jsonText) as TripItinerary;

    // Basic validation of the structure
    if (!parsedResponse.summary || !Array.isArray(parsedResponse.days) || !Array.isArray(parsedResponse.tips)) {
      throw new Error("Invalid response structure");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse trip itinerary from AI response");
  }
}
