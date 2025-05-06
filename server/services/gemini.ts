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
    ? `\nThe traveler will be staying at: ${tripPrompt.accommodation}. At the end of each day's activities, include directions for getting back to this accommodation. Also include a specific tip about the best transportation method to use for returning to this accommodation.` 
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
            "description": "Activity description"
          },
          {
            "time": "End of day",
            "title": "Return to accommodation",
            "description": "Directions for returning to accommodation including transportation options"
          }
        ]
      }
    ],
    "tips": ["Tip 1", "Tip 2"]
  }

  The itinerary should include day-by-day activities with timing, dining recommendations, and must-see attractions.
  Focus on the selected interests and fit within the budget constraints. Include local experiences and hidden gems.
  Include 3-5 practical travel tips specific to the destination.
  ${tripPrompt.accommodation ? 'Make sure each day ends with detailed instructions for returning to the accommodation including specific transportation options, routes, estimated time and costs.' : ''}
  Please strictly follow the JSON structure provided.
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
