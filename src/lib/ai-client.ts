import { genAI, systemPrompt } from './ai-config';

export async function reviewGrantApplication(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: systemPrompt,
    });
    
    const prompt = `Review this grant application and provide your response in the required format with ===FEEDBACK=== and ===REWRITE=== sections.

Focus your feedback on:
- Clarity and impact statements
- Budget justification
- Project timeline and milestones
- Success metrics and evaluation
- Overall persuasiveness

Grant application:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error reviewing grant application:', error);
    throw new Error('Failed to review grant application');
  }
}

export async function implementSuggestions(original: string, feedback: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: systemPrompt,
    });
    
    const prompt = `Create a final version of this grant application by implementing the previous feedback.

Original application:
${original}

Previous feedback:
${feedback}

Provide your response in the required format:

===FEEDBACK===
Brief summary of implemented changes

===REWRITE===
(Your complete final version here)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error implementing suggestions:', error);
    throw new Error('Failed to implement suggestions');
  }
}