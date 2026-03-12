const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

export const generateProductDescription = async (productName, language) => {
  try {
    const languageNames = {
      tr: 'Turkish',
      en: 'English',
      ru: 'Russian',
      de: 'German',
      fr: 'French'
    };
    const targetLanguage = languageNames[language] || 'Turkish';

    const prompt = `You are a creative and expert culinary copywriter for a premium restaurant's digital menu. Write an enticing, mouth-watering description for a menu item named: "${productName}".
The description MUST be written in ${targetLanguage} language.
Crucial instructions:
1. Make it very concise (maximum 2 short sentences).
2. DO NOT use repetitive openers. Be highly creative, unique, and engaging for each different food.
3. Focus directly on the customer experience, appealing to their senses.
4. Return ONLY the description text without quotes, without introductory statements.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_completion_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    let text = data.choices[0].message.content.trim();
    // Clean up potential quotes if the AI decides to wrap it
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
    }
    return text;
  } catch (error) {
    console.error('Error generating AI description:', error);
    throw error;
  }
};
