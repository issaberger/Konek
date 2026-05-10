import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'undefined' || key.includes('YOUR_')) {
      throw new Error("Missing or invalid GEMINI_API_KEY environment variable. Please make sure to configure the GEMINI_API_KEY secret in your deployment environment (e.g., Cloud Run).");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const grokApiKey = process.env.VITE_GROK_API_KEY || process.env.GROK_API_KEY;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Implement Security Headers (CSP, HSTS, X-Frame-Options)
  app.use((req, res, next) => {
    // Content Security Policy
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com/ https://*.firebaseapp.com https://connect.facebook.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https: https://www.facebook.com; " +
      "connect-src 'self' https: wss: ws:; " +
      "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/ https://*.firebaseapp.com;"
    );
    // Strict-Transport-Security (HSTS)
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    // X-Frame-Options
    res.setHeader("X-Frame-Options", "DENY");
    // X-Content-Type-Options
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });

  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/solve", async (req, res) => {
    try {
      const { base64Image, voicePrompt, language, mimeType } = req.body;
      const langName = language === 'fr' ? 'French' : 'Haitian Creole (Kreyòl Ayisyen)';
      
      const visionPrompt = `
        You are an expert teacher. Look at this homework image.
        1. Transcribe the exact problem text.
        2. Identify the subject (Math, Science, French, etc.).
        ${voicePrompt ? `The student also asked: "${voicePrompt}"` : ''}
        
        Return a JSON object with 'problem_text' and 'subject'.
      `;

      const visionResponse = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType || "image/jpeg", data: base64Image } },
            { text: visionPrompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problem_text: { type: Type.STRING },
              subject: { type: Type.STRING }
            },
            required: ["problem_text", "subject"]
          }
        }
      });

      let visionData: any = {};
      try {
        const cleaned = (visionResponse.text || "{}").replace(/```json/g, '').replace(/```/g, '').trim();
        visionData = JSON.parse(cleaned);
      } catch(e) {}
      
      const problemText = visionData.problem_text || (language === 'fr' ? "Impossible de lire le problème clairement." : "Pa ka li pwoblèm nan klèman.");
      const subject = visionData.subject || (language === 'fr' ? "Général" : "Jeneral");

      const tutorPrompt = `
        You are Konèk, a patient, warm, and encouraging AI homework tutor for students in Haiti.
        Your goal is to help the student understand the problem step-by-step, not just give the answer.
        
        Subject: ${subject}
        Problem: ${problemText}
        ${voicePrompt ? `Student's question: "${voicePrompt}"` : ''}
        
        Instructions:
        1. Respond ENTIRELY in natural, everyday ${langName}.
        2. Be encouraging and proud of Haitian culture.
        3. Break down the solution into clear steps.
        4. Use Markdown for formatting. Use MathJax (e.g., $$x^2$$ or $x$) for math.
        5. Include a section called "Resous ak Referans" (in ${langName}) at the end with 2-3 helpful links or book references related to the topic.
        6. End with an encouraging message.
      `;

      let solutionText = "";

      if (grokApiKey) {
        try {
          const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${grokApiKey}`
            },
            body: JSON.stringify({
              model: "grok-2",
              messages: [
                { role: "system", content: `You are Konèk, a patient, warm, and encouraging AI homework tutor for students in Haiti. Respond entirely in ${langName}. Use Markdown and MathJax.` },
                { role: "user", content: tutorPrompt }
              ],
              temperature: 0.7
            })
          });
          
          if (grokResponse.ok) {
            const grokData = await grokResponse.json();
            if (grokData.choices && grokData.choices[0]) {
              solutionText = grokData.choices[0].message.content;
            }
          } else {
             console.error("Grok API error", grokResponse.status);
          }
        } catch (e) {
          console.error("Grok API failed", e);
        }
      }

      if (!solutionText) {
        const tutorResponse = await getAI().models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: tutorPrompt,
        });
        solutionText = tutorResponse.text || (language === 'fr' ? "Désolé, je ne peux pas résoudre cela pour le moment." : "Eskize m, mwen pa ka rezoud sa kounye a.");
      }

      const practicePrompt = `
        Based on this problem: "${problemText}" and solution: "${solutionText}",
        generate 1 multiple-choice practice question to test if the student understood the concept.
        Write it entirely in ${langName}.
      `;

      const practiceResponse = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: practicePrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correct_answer: { type: Type.STRING }
            },
            required: ["question", "options", "correct_answer"]
          }
        }
      });

      let practiceData: any = {};
      try {
        const cleaned = (practiceResponse.text || "{}").replace(/```json/g, '').replace(/```/g, '').trim();
        practiceData = JSON.parse(cleaned);
      } catch(e) {}
      
      const safePracticeQuestion = {
        question: practiceData.question || (language === 'fr' ? "Qu'avez-vous appris de ce devoir ?" : "Kisa ou te aprann nan devwa sa a?"),
        options: Array.isArray(practiceData.options) && practiceData.options.length > 0 ? practiceData.options : (language === 'fr' ? ["Je comprends", "J'ai besoin de plus d'aide"] : ["Mwen konprann", "Mwen bezwen plis èd"]),
        correct_answer: practiceData.correct_answer || (language === 'fr' ? "Je comprends" : "Mwen konprann")
      };

      res.json({
        problemText,
        solutionText,
        practiceQuestion: safePracticeQuestion
      });
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.message || 'An unknown error occurred';
      if (errorMessage.includes('API key not valid') || String(error).includes('API_KEY_INVALID')) {
        errorMessage = 'Depi ou sou pwòp domèn ou, asire w ou mete yon GEMINI_API_KEY valab nan anviwònman w lan. (API Key invalid)';
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/speech", async (req, res) => {
    try {
      const { text } = req.body;
      const voiceName = 'Aoede'; 
      const cleanedText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\$\$(.*?)\$\$/g, ' $1 ')
        .replace(/\$(.*?)\$/g, ' $1 ')
        .replace(/#/g, '')
        .replace(/>/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\n/g, ' ')
        .trim();
        
      const response = await getAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: cleanedText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }, 
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      res.json({ audio: base64Audio });
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.message || 'An unknown error occurred';
      if (errorMessage.includes('API key not valid') || String(error).includes('API_KEY_INVALID')) {
        errorMessage = 'Depi ou sou pwòp domèn ou, asire w ou mete yon GEMINI_API_KEY valab nan anviwònman w lan. (API Key invalid)';
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
