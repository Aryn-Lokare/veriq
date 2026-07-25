import { ChatGroq } from "@langchain/groq";
import { BaseMessage } from "@langchain/core/messages";

export interface InvokeableModel {
  invoke(messages: BaseMessage[]): Promise<{ content: string }>;
}

class GeminiModel implements InvokeableModel {
  constructor(private modelName: string, private temperature: number) {}

  public async invoke(messages: BaseMessage[]): Promise<{ content: string }> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY or GOOGLE_API_KEY is not configured in the environment.");
    }

    const formattedMessages = messages.map((m) => {
      let role = "user";
      const type = m.getType();
      if (type === "system") {
        role = "system";
      } else if (type === "ai") {
        role = "assistant";
      }
      
      const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
      return { role, content };
    });

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey || ""}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: formattedMessages,
          temperature: this.temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || "";
      return { content };
    } catch (error) {
      console.error(`Gemini API call failed for model ${this.modelName}:`, error);
      throw error;
    }
  }
}

class GroqModel implements InvokeableModel {
  constructor(private modelName: string, private temperature: number) {}

  public async invoke(messages: BaseMessage[]): Promise<{ content: string }> {
    if (!process.env.GROQ_API_KEY) {
      console.warn("WARNING: GROQ_API_KEY is not configured in the environment.");
    }

    const client = new ChatGroq({
      model: this.modelName,
      apiKey: process.env.GROQ_API_KEY,
      temperature: this.temperature,
      maxRetries: 5,
    });

    const response = await client.invoke(messages);
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return { content };
  }
}

export class ModelService {
  public static getModel(
    type: 'versatile' | 'instant' | 'gemini' = 'versatile',
    temperature = 0.1
  ): InvokeableModel {
    if (type === 'gemini') {
      // Use Gemini 2.5 Flash as requested in earlier requirements
      return new GeminiModel("gemini-2.5-flash", temperature);
    }

    const modelName = type === 'versatile' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";

    return new GroqModel(modelName, temperature);
  }
}

