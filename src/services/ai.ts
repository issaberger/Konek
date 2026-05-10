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

export const solveHomework = async (imageFile: File, voicePrompt?: string, language: string = 'ht') => {
  try {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch('/api/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base64Image,
        mimeType: imageFile.type,
        voicePrompt,
        language
      })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(`AI Error: ${error.message}`);
  }
};

export const generateSpeech = async (text: string, language: string = 'ht'): Promise<string | null> => {
  try {
    const response = await fetch('/api/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        language
      })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `TTS API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
