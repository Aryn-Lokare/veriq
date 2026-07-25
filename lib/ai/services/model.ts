import { ChatGroq } from "@langchain/groq";

export class ModelService {
  public static getModel(type: 'versatile' | 'instant' = 'versatile', temperature = 0.1): ChatGroq {
    if (!process.env.GROQ_API_KEY) {
      console.warn("WARNING: GROQ_API_KEY is not configured in the environment.");
    }

    const modelName = type === 'versatile' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";

    return new ChatGroq({
      model: modelName,
      apiKey: process.env.GROQ_API_KEY,
      temperature,
    });
  }
}
