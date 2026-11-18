import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // We shouldn't strictly maintain history directly using the sdk in a stateless API without care, 
    // but the genai SDK handles simple chat. Let's do a simple generateContent with context
    
    let contents = [
      { role: "user", parts: [{ text: "You are an AI assistant for a Master's course in Mathematics Education at UNS handling the topic 'Rate of Change of Rice Prices in Pasar Tradisional Jebres'. Answer the following question or respond to the user concisely and educationally." }] },
    ];
    
    if (history && Array.isArray(history)) {
      contents = contents.concat(history);
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    if (error.status === 429 || error.message?.includes("quota")) {
      res.status(429).json({ error: "API Quota limit reached. Silakan tunggu beberapa saat." });
    } else if (error.status === 503 || error.message?.includes("high demand") || error.message?.includes("overloaded")) {
      res.status(503).json({ error: "Sistem AI sedang sibuk. Mohon tunggu beberapa saat dan coba lagi." });
    } else {
      res.status(500).json({ error: "Failed to generate response" });
    }
  }
});

app.post("/api/generate-case", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate exactly one short case study problem suitable for S2 Pendidikan Matematika students. The problem should deal with predicting or calculating the rate of change of rice price based on the model dP/dt = k(Qd-Qs). Provide only the problem statement without the direct answer, ensure it mentions Pasar Jebres. Make sure the implicit or explicit value of constant k is strictly a positive number in the hundreds up to 1000 (e.g., k = 200, 500, or 1000). Do not use negative values for k.",
    });
    res.json({ caseProblem: response.text });
  } catch (error: any) {
    console.error("Case generation error:", error);
    if (error.status === 429 || error.message?.includes("quota")) {
      res.status(429).json({ error: "API Quota limit reached. Silakan tunggu beberapa saat dan coba lagi." });
    } else if (error.status === 503 || error.message?.includes("high demand") || error.message?.includes("overloaded")) {
      res.status(503).json({ error: "Sistem AI sedang sibuk. Mohon tunggu beberapa saat dan coba lagi." });
    } else {
      res.status(500).json({ error: "Failed to generate case problem" });
    }
  }
});

app.post("/api/evaluate-case", async (req, res) => {
  try {
    const { problem, answer } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Evaluate a student's answer to the following case problem.
Problem: ${problem}

Student's Answer: ${answer}

You are an encouraging educational assistant. Do not just give the final answer. Provide constructive feedback that includes scaffolding—guide the student step-by-step toward the correct solution if they made a mistake. Ask prompting questions to help them reflect on their mathematical modeling of dP/dt = k(Qd - Qs).
Provide an object with two fields:
1. "score": A number from 0 to 100 representing the grade.
2. "feedback": Scaffolding feedback, utilizing markdown with LaTeX equations to guide the student's learning process. IMPORTANT: Since this is JSON, you MUST double-escape all LaTeX backslashes (e.g. use \\\\frac instead of \\frac). Do NOT double-escape newlines, just use standard \n for line breaks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Grade from 0 to 100" },
            feedback: { type: Type.STRING, description: "Constructive feedback" },
          },
          required: ["score", "feedback"],
        },
      },
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    if (result.feedback) {
      result.feedback = result.feedback.replace(/\\n/g, '\n');
    }
    res.json(result);
  } catch (error: any) {
    console.error("Evaluation error:", error);
    if (error.status === 429 || error.message?.includes("quota")) {
      res.status(429).json({ error: "API Quota limit reached. Silakan tunggu beberapa saat dan coba lagi." });
    } else if (error.status === 503 || error.message?.includes("high demand") || error.message?.includes("overloaded")) {
      res.status(503).json({ error: "Sistem AI sedang sibuk. Mohon tunggu beberapa saat dan coba lagi." });
    } else {
      res.status(500).json({ error: "Failed to evaluate answer" });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
