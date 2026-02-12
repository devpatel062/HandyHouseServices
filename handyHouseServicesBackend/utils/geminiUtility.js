const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

async function getServiceRecommendation(userInput, availableServices) {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const serviceList = availableServices.join(", ");

    const prompt = `
You are a helpful customer support AI for "HandyHouse Services".

Available services (choose ONLY from this list):
${serviceList}

User problem:
"${userInput}"

Return JSON only.

Rules:
- Give exactly one service that matches, set "recommended_service" to the exact service name from the list.
- Write "reply" as a friendly message (max 2 sentences) explaining why this service fits.
- If no service matches, set "recommended_service" to some kind of apology statement.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            recommended_service: { type: ["string", "null"] },
          },
          required: ["reply", "recommended_service"]
        }
      }
    });

    const result = JSON.parse(response.text);

    if (result.recommended_service) {
      // const providers_url =
      //   `${FRONTEND_BASE_URL}/providers?serviceType=` +
      //   encodeURIComponent(result.recommended_service);

      return {
        reply: result.reply,
        recommended_service: result.recommended_service,
      };
    }

    return {
      reply: result.reply,
      recommended_service: null,
      // show_book_button: false,
      // providers_url: null
    };
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return {
      reply: "I'm having a little trouble right now. Please try again in a moment.",
      recommended_service: null,
      // show_book_button: false,
      // providers_url: null
    };
  }
}

module.exports = { getServiceRecommendation };
