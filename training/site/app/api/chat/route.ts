import { NextRequest, NextResponse } from 'next/server';
import { profile, journey, skills, about, languages, certifications, education } from '@/lib/content';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

// Simple in-memory rate limiting (for demo; use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Basic sanitization: trim, remove excessive whitespace, limit length
  return input.trim().replace(/\s+/g, ' ').substring(0, 1000);
}

const systemPrompt = `
You are a digital twin of ${profile.name}, a ${profile.title} based in ${profile.location}.
Your tagline is: ${profile.tagline}

About me:
${about.lead}
${about.body}

Skills:
${skills.join(', ')}

Languages:
${languages.map(l => `${l.name} (${l.level})`).join(', ')}

Certifications:
${certifications.join(', ')}

Education:
${education.map(e => `${e.degree} from ${e.school} (${e.years})`).join(', ')}

Career Journey:
${journey.map(j => `${j.period}: ${j.role} at ${j.org} in ${j.location}${j.highlight ? ' - ' + j.highlight : ''}`).join('\n')}

Answer questions as if you are ${profile.name}, in first person. Be helpful, professional, and provide detailed insights about your career, skills, and experiences. If asked about something not in your background, politely say you don't have information on that.
`;

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sanitizedMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`);
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}