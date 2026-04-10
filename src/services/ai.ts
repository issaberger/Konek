import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/jpeg;base64, part
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const solveHomework = async (imageFile: File, voicePrompt?: string) => {
  const base64Image = await fileToBase64(imageFile);
  
  // Step 1: OCR and understand the problem using Gemini Flash
  const visionPrompt = `
    You are an expert teacher. Look at this homework image.
    1. Transcribe the exact problem text.
    2. Identify the subject (Math, Science, French, etc.).
    ${voicePrompt ? `The student also asked: "${voicePrompt}"` : ''}
    
    Return a JSON object with 'problem_text' and 'subject'.
  `;

  const visionResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: imageFile.type, data: base64Image } },
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

  const visionData = JSON.parse(visionResponse.text || "{}");
  const problemText = visionData.problem_text || "Pa ka li pwoblèm nan.";
  const subject = visionData.subject || "Jeneral";

  // Step 2: Generate the tutoring explanation in Kreyòl
  // We use Gemini Pro for the complex reasoning and translation
  const tutorPrompt = `
    You are Konek, a patient, warm, and encouraging AI homework tutor for students in Haiti.
    Your goal is to help the student understand the problem step-by-step, not just give the answer.
    
    Subject: ${subject}
    Problem: ${problemText}
    ${voicePrompt ? `Student's question: "${voicePrompt}"` : ''}
    
    Instructions:
    1. Respond ENTIRELY in natural, everyday Kreyòl Ayisyen (Haitian Creole).
    2. Be encouraging and proud of Haitian culture.
    3. Break down the solution into clear steps.
    4. Use Markdown for formatting. Use MathJax (e.g., $$x^2$$ or $x$) for math.
    5. End with an encouraging message.
  `;

  const grokApiKey = (import.meta as any).env.VITE_GROK_API_KEY;
  let solutionText = "";

  if (grokApiKey) {
    try {
      // Try using Grok if API key is provided
      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${grokApiKey}`
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: "You are Konek, a patient, warm, and encouraging AI homework tutor for students in Haiti. Respond entirely in Kreyòl Ayisyen. Use Markdown and MathJax." },
            { role: "user", content: tutorPrompt }
          ]
        })
      });
      const grokData = await grokResponse.json();
      solutionText = grokData.choices[0].message.content;
    } catch (e) {
      console.error("Grok API failed, falling back to Gemini", e);
    }
  }

  if (!solutionText) {
    // Fallback to Gemini Pro
    const tutorResponse = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: tutorPrompt,
    });
    solutionText = tutorResponse.text || "Eskize m, mwen pa ka rezoud sa kounye a.";
  }

  // Step 3: Generate practice questions
  const practicePrompt = `
    Based on this problem: "${problemText}" and solution: "${solutionText}",
    generate 1 multiple-choice practice question to test if the student understood the concept.
    Write it entirely in Kreyòl Ayisyen.
  `;

  const practiceResponse = await ai.models.generateContent({
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

  const practiceData = JSON.parse(practiceResponse.text || "{}");

  return {
    problemText,
    solutionText,
    practiceQuestion: practiceData
  };
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
