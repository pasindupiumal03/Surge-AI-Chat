import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_AI_API;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
  }

  const prompt = `Generate a single multiple-choice trading quiz question.\nRespond ONLY with a valid JSON object, no explanation, no markdown, no preamble.\nFormat: { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B) ...", "explanation": "..." }`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful trading assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || 'OpenAI API error.' }, { status: 500 });
    }

    const data = await response.json();
    // Try to extract and parse the JSON from the AI's response
    let content = data.choices?.[0]?.message?.content || '{}';
    const match = content.match(/{[\s\S]*}/);
    let quiz;
    try {
      quiz = JSON.parse(match ? match[0] : content);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse quiz JSON from OpenAI.' }, { status: 500 });
    }
    if (!quiz.question || !quiz.options || !quiz.correct || !quiz.explanation) {
      return NextResponse.json({ error: 'Incomplete quiz data from OpenAI.' }, { status: 500 });
    }
    return NextResponse.json(quiz);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to contact OpenAI API.' }, { status: 500 });
  }
}