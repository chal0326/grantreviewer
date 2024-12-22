interface ParsedResponse {
  feedback: string;
  rewrite: string;
}

export function parseAIResponse(response: string): ParsedResponse {
  // Use more specific delimiters
  const feedbackMatch = response.match(/===FEEDBACK===([\s\S]*?)(?:===REWRITE===)/);
  const rewriteMatch = response.match(/===REWRITE===([\s\S]*?)$/);

  if (!feedbackMatch || !rewriteMatch) {
    // If parsing fails, treat the whole response as feedback
    console.warn('Failed to parse AI response sections');
    return {
      feedback: response.trim(),
      rewrite: '',
    };
  }

  return {
    feedback: feedbackMatch[1].trim(),
    rewrite: rewriteMatch[1].trim(),
  };
}