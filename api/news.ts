// File: /api/news.ts
// This is your new Vercel Serverless Function

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. Get the API key from Vercel's Environment Variables
  // IMPORTANT: This reads from your Vercel project settings, NOT your .env file
  const API_KEY = process.env.VITE_NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'News API key is missing on server' });
  }

  // 2. Enhanced query specifically for real estate, property, and housing news
  // Exclude political terms and focus on property/real estate industry
  const query = '(("real estate" OR "property market" OR "housing market" OR "home prices" OR "property sales") AND (buyers OR sellers OR investment OR construction OR developers)) NOT (trump OR biden OR election OR congress OR senate OR white house OR politics)';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&language=en&sortBy=publishedAt&pageSize=20&domains=realtor.com,zillow.com,redfin.com,inman.com,housingwire.com,therealdeal.com,bisnow.com,cpexecutive.com,globest.com,rew-online.com,propmodo.com`;

  try {
    // 3. Call the NewsAPI from the server
    const newsResponse = await fetch(url);

    // 4. If the NewsAPI request failed, pass its error along
    if (!newsResponse.ok) {
      const errData = await newsResponse.json();
      console.error('NewsAPI Error:', errData.message);
      return res.status(newsResponse.status).json({ error: errData.message || 'Failed to fetch news' });
    }

    // 5. Success! Get the JSON data
    const data = await newsResponse.json();

    // 6. Set cache headers (optional but recommended)
    // This tells Vercel to cache the result for 1 hour to avoid hitting your API rate limit
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // 7. Send the data back to your frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}