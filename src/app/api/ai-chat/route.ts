import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const apiKey = process.env.OPENAI_AI_API;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 500 }
    );
  }
  if (!question) {
    return NextResponse.json(
      { error: "No question provided." },
      { status: 400 }
    );
  }

  // Fetch real market data
  let marketData = "";
  try {
    // Fetch top cryptocurrencies data
    const cryptoResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
    );
    
    if (cryptoResponse.ok) {
      const cryptoData = await cryptoResponse.json();
      marketData = `Current Top 10 Cryptocurrency Market Data:
${cryptoData.map((coin: any, index: number) => 
  `${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()} (${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2)}% 24h)`
).join('\n')}

Market Cap Total: $${cryptoData.reduce((sum: number, coin: any) => sum + coin.market_cap, 0).toLocaleString()}`;
    }

    // Fetch global market data
    const globalResponse = await fetch("https://api.coingecko.com/api/v3/global");
    if (globalResponse.ok) {
      const globalData = await globalResponse.json();
      const data = globalData.data;
      marketData += `\n\nGlobal Market Overview:
- Total Market Cap: $${data.total_market_cap.usd.toLocaleString()}
- Total Volume (24h): $${data.total_volume.usd.toLocaleString()}
- Bitcoin Dominance: ${data.market_cap_percentage.btc.toFixed(1)}%
- Active Cryptocurrencies: ${data.active_cryptocurrencies.toLocaleString()}`;
    }
  } catch (error) {
    console.error("Error fetching market data:", error);
    marketData = "Unable to fetch current market data at the moment.";
  }

  const prompt = `You are a helpful, knowledgeable cryptocurrency and trading assistant. 
The user asked: "${question}"

Here is the current REAL cryptocurrency market data:
${marketData}

Please provide helpful, accurate trading advice and market insights based on this real market data. 

IMPORTANT FORMATTING RULES:
- Do NOT use any markdown formatting like #, **, -, •, etc.
- Use simple plain text only
- Use line breaks and spacing for readability
- Use simple bullet points with just text
- Keep responses conversational and easy to read
- No headers, bold text, or special formatting

Focus on:
- Current market trends and analysis
- Price movements and what they might indicate  
- General trading strategies and risk management
- Educational content about cryptocurrency trading
- Market sentiment analysis

If the user asks about specific coins, refer to the real market data provided above.
If the user's message is a greeting or general question, respond naturally and offer to help with market analysis.

Always give clear, actionable, and educational answers. Never provide financial advice, but offer educational insights about trading concepts and market analysis.

Keep your response conversational, informative, and easy to read without any special formatting.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful cryptocurrency trading assistant that provides educational market analysis and insights. Always respond in plain text without any markdown formatting, headers, or special characters. Keep responses conversational and easy to read." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "OpenAI API error." },
        { status: 500 }
      );
    }

    const data = await response.json();
    let aiMessage =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";
    
    // Clean up any remaining markdown formatting
    aiMessage = aiMessage
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code formatting
      .replace(/^\s*[-•]\s/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s/gm, '') // Remove numbered lists
      .trim();
    
    return NextResponse.json({ answer: aiMessage });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to contact OpenAI API." },
      { status: 500 }
    );
  }
}