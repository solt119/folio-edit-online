
interface OpenAITranslationResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const translateWithOpenAI = async (text: string, fromLang: 'de' | 'en', toLang: 'de' | 'en', apiKey?: string): Promise<string> => {
  if (fromLang === toLang) return text;
  
  // Use API key from localStorage if not provided
  const openaiKey = apiKey || localStorage.getItem('openai_api_key');
  
  if (!openaiKey) {
    console.warn('OpenAI API key not found, falling back to basic translation');
    return text;
  }

  const systemPrompt = fromLang === 'de' && toLang === 'en' 
    ? 'You are a professional CV translator. Translate the following German CV text to English. Use natural, professional language as commonly used in English CVs. Return ONLY the translated text without any explanations or additional text.'
    : 'You are a professional CV translator. Translate the following English CV text to German. Use natural, professional language as commonly used in German CVs. Return ONLY the translated text without any explanations or additional text.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAITranslationResponse = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim();
    
    if (translatedText) {
      console.log(`OpenAI translation: "${text}" -> "${translatedText}"`);
      return translatedText;
    }
    
    throw new Error('No translation received from OpenAI');
  } catch (error) {
    console.error('OpenAI translation failed:', error);
    // Fallback to basic translation
    return text;
  }
};

export const translateCVDataWithOpenAI = async (data: any, fromLang: 'de' | 'en', toLang: 'de' | 'en', apiKey?: string): Promise<any> => {
  if (fromLang === toLang) return data;
  
  const translateObject = async (obj: any): Promise<any> => {
    if (typeof obj === 'string' && obj.trim().length > 0) {
      return await translateWithOpenAI(obj, fromLang, toLang, apiKey);
    }
    
    if (Array.isArray(obj)) {
      const translated = [];
      for (const item of obj) {
        translated.push(await translateObject(item));
      }
      return translated;
    }
    
    if (obj && typeof obj === 'object') {
      const translated: any = {};
      for (const [key, value] of Object.entries(obj)) {
        translated[key] = await translateObject(value);
      }
      return translated;
    }
    
    return obj;
  };
  
  return await translateObject(data);
};
