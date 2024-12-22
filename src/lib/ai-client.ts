import { genAI, systemPrompt } from './ai-config';
import type { Database } from '../types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function reviewGrantApplication(
  text: string, 
  supabase: SupabaseClient<Database>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat();
    await chat.sendMessage(systemPrompt);
    
    const prompt = `Review this grant application and provide your response in the required format with ===FEEDBACK=== and ===REWRITE=== sections.

Focus your feedback on:
- Clarity and impact statements
- Budget justification
- Project timeline and milestones
- Success metrics and evaluation
- Overall persuasiveness

Grant application:
${text}`;

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    const feedback = response.match(/===FEEDBACK===([\s\S]*?)(?:===REWRITE===)/)?.[1]?.trim() || '';
    const rewrite = response.match(/===REWRITE===([\s\S]*?)$/)?.[1]?.trim() || '';

    const { error } = await supabase
      .from('grant_reviews')
      .insert({
        original_text: text,
        feedback,
        rewrite,
        revised_text: rewrite,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing review in Supabase:', error);
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Error in reviewGrantApplication:', error);
    throw error;
  }
}

export async function implementSuggestions(
  original: string, 
  feedback: string,
  supabase: SupabaseClient<Database>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat();
    await chat.sendMessage(systemPrompt);
    
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

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error implementing suggestions:', error);
    throw new Error('Failed to implement suggestions');
  }
}