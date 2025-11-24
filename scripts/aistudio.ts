const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyAUibiHLxWuBCE6HAXcn6O_aypINcO56Iw"); //api key

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: process.env.GEMINI_MODE === "json" ? "application/json" : "text/plain",
};

async function getGenerativeAIResponse(prompt: string) {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text().trim().replace(/```/g, "");
}

export default getGenerativeAIResponse;
