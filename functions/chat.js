/**
 * Gatsby Serverless Function: RAG chatbot proxy
 *
 * The personal website should not hold Gemini/Groq keys or call model APIs
 * directly. It forwards chat requests to the separate RAG service instead.
 *
 * Local default:
 *   RAG_API_URL=http://localhost:8787/chat
 *
 * Production:
 *   Set RAG_API_URL to the deployed RAG service /chat endpoint.
 */

const DEFAULT_LOCAL_RAG_API_URL = 'http://localhost:8787/chat';
const RAG_API_URL = process.env.RAG_API_URL || DEFAULT_LOCAL_RAG_API_URL;

exports.handler = async event => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed', fallback: true }),
    };
  }

  try {
    const { question, limit } = JSON.parse(event.body || '{}');

    if (!question || !String(question).trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Question is required', fallback: true }),
      };
    }

    const response = await fetch(RAG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: String(question).trim(),
        limit: limit || 5,
      }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      console.error('RAG API error:', data);
      return buildFallbackResponse(headers, data?.message || data?.error);
    }

    if (!data?.answer) {
      return buildFallbackResponse(headers, 'RAG API returned no answer.');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        answer: data.answer,
        provider: data.provider || 'rag',
        sources: data.sources || [],
        fallback: false,
      }),
    };
  } catch (error) {
    console.error('Error calling RAG API:', error);
    return buildFallbackResponse(headers, error.message);
  }
};

async function safeJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function buildFallbackResponse(headers, error) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      answer:
        'I\'m having trouble reaching my research knowledge base right now. You can still ask about research, projects, publications, or contact details.',
      fallback: true,
      error,
    }),
  };
}
