// src/components/NewsAndBlogs.tsx
// --- UPDATED CODE ---

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rss, Newspaper, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import the images you are already using on your landing page
import heroHome1 from '@/assets/hero-home-1.jpg';
import heroHome2 from '@/assets/hero-home-2.jpg';
import analyticsImage from '@/assets/analytics-bg.jpg';

// Define the structure for an article
interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sourceName: string;
  publishedAt: string; // Use ISO string for consistency
  articleUrl: string;
  category: 'News' | 'Forecast' | 'Blog';
}

// --- MOCK DATA (Expanded to 10 articles) ---
// This data is now a fallback in case the API fails.
const mockNewsData: Article[] = [
  {
    id: '1',
    title: 'Housing Market Forecast: What to Expect in 2026',
    description: 'Top economists analyze post-pandemic trends and predict a stabilization in housing prices, driven by new inventory.',
    imageUrl: heroHome1,
    sourceName: 'RealEstate Today',
    publishedAt: '2025-10-22T14:30:00Z',
    articleUrl: '#',
    category: 'Forecast',
  },
  {
    id: '2',
    title: 'AI in Real Estate: How Tech is Changing Property Valuation',
    description: 'Learn how machine learning models, like the one this platform uses, are providing unprecedented accuracy in home pricing.',
    imageUrl: analyticsImage,
    sourceName: 'Tech Property',
    publishedAt: '2025-10-21T11:00:00Z',
    articleUrl: '#',
    category: 'Blog',
  },
  {
    id: '3',
    title: 'National Home Prices See Slight Dip in October',
    description: 'The national average home price decreased by 0.5% this month, offering a small window of opportunity for buyers.',
    imageUrl: heroHome2,
    sourceName: 'MarketWatch',
    publishedAt: '2025-10-20T09:15:00Z',
    articleUrl: '#',
    category: 'News',
  },
  {
    id: '4',
    title: 'Luxury Property Boom: London Mansions See Record Sales',
    description: 'A new report highlights a surge in luxury property sales in central London, driven by international investors.',
    imageUrl: heroHome1,
    sourceName: 'Luxury Estates',
    publishedAt: '2025-10-19T10:00:00Z',
    articleUrl: '#',
    category: 'News',
  },
  {
    id: '5',
    title: 'The Rise of "PropTech": 5 Startups to Watch',
    description: 'Property Technology (PropTech) is disrupting the industry. Here are five innovative companies changing the game.',
    imageUrl: analyticsImage,
    sourceName: 'PropTech Insider',
    publishedAt: '2025-10-18T16:45:00Z',
    articleUrl: '#',
    category: 'Blog',
  },
  {
    id: '6',
    title: 'Commercial Real Estate Adapts to Remote Work',
    description: 'Office vacancy rates are at an all-time high. See how landlords are repurposing commercial spaces.',
    imageUrl: heroHome2,
    sourceName: 'Financial Times',
    publishedAt: '2025-10-17T08:00:00Z',
    articleUrl: '#',
    category: 'News',
  },
  {
    id: '7',
    title: 'Housing Affordability Crisis Deepens in North America',
    description: 'Median home prices continue to outpace wage growth, putting pressure on policymakers to find solutions.',
    imageUrl: heroHome1,
    sourceName: 'Global Housing',
    publishedAt: '2025-10-16T12:00:00Z',
    articleUrl: '#',
    category: 'News',
  },
  {
    id: '8',
    title: 'Interest Rate Hikes: Impact on Mortgages and Housing',
    description: 'Central banks are raising rates. We analyze what this means for prospective homebuyers and current owners.',
    imageUrl: analyticsImage,
    sourceName: 'Economic Times',
    publishedAt: '2025-10-15T14:20:00Z',
    articleUrl: '#',
    category: 'Forecast',
  },
  {
    id: '9',
    title: 'Top 10 Emerging Real Estate Markets in Asia',
    description: 'From Ho Chi Minh City to Bangalore, discover the next hotspots for property investment in Asia.',
    imageUrl: heroHome2,
    sourceName: 'Asia Property News',
    publishedAt: '2025-10-14T11:30:00Z',
    articleUrl: '#',
    category: 'News',
  },
  {
    id: '10',
    title: 'Sustainable Building: The Future of Home Construction',
    description: 'Green building materials and energy-efficient designs are no longer a niche, but a necessity. A look at the latest trends.',
    imageUrl: heroHome1,
    sourceName: 'Eco Homes Blog',
    publishedAt: '2025-10-13T09:00:00Z',
    articleUrl: '#',
    category: 'Blog',
  },
];


// A helper function to format the date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// A helper component for the loading state
const SkeletonCard = () => (
  <Card className="flex flex-col h-full bg-white/60 backdrop-blur-sm border-0 overflow-hidden shadow-lg animate-pulse">
    <div className="h-48 w-full bg-gray-300" />
    <div className="p-6 flex-1 flex flex-col justify-between">
      <div>
        <div className="h-4 w-1/3 bg-gray-300 rounded mb-4" />
        <div className="h-6 w-full bg-gray-300 rounded mb-3" />
        <div className="h-6 w-5/6 bg-gray-300 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-4" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-1/4 bg-gray-300 rounded" />
        <div className="h-4 w-1/3 bg-gray-300 rounded" />
      </div>
    </div>
  </Card>
);

const NewsAndBlogs = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ⭐ THIS IS THE UPDATED useEffect HOOK ---
  useEffect(() => {
    const fetchRealNews = async () => {
      setLoading(true);
      
      // 1. Call your own API route. No API key is needed here!
      const url = '/api/news'; 

      try {
        const response = await fetch(url); // Call your own backend
        const data = await response.json();

        // 2. Check if your *own* server (or NewsAPI via your server) sent an error
        if (!response.ok) {
          throw new Error(data.error || 'Network response was not ok');
        }

        // 3. The rest of your logic is the same!
        if (data.status === "ok") {
          const fetchedArticles: Article[] = data.articles.map((article: any, index: number) => ({
            id: article.url || `real-article-${index}`,
            title: article.title,
            description: article.description || "No description available.",
            imageUrl: article.urlToImage || analyticsImage, // Use a fallback image
            sourceName: article.source.name,
            publishedAt: article.publishedAt,
            articleUrl: article.url,
            // Simple logic to categorize articles
            category: article.title.toLowerCase().includes('forecast') 
              ? 'Forecast' 
              : (article.source.name.toLowerCase().includes('blog') ? 'Blog' : 'News'),
          }));
          setArticles(fetchedArticles);
        } else {
          // This handles cases where the API call was successful but NewsAPI returned an error
          console.error("Error from NewsAPI:", data.message);
          setArticles(mockNewsData); // Fallback to mock data on API error
        }
      } catch (error) {
        console.error("Failed to fetch real news:", error);
        setArticles(mockNewsData); // Fallback to mock data on network error
      }
      setLoading(false);
    };

    fetchRealNews();
  }, []); // This hook still only runs once on mount


  const getCategoryBadge = (category: Article['category']) => {
    switch (category) {
      case 'Forecast':
        return (
          <Badge className="bg-blue-100 text-blue-700">{category}</Badge>
        );
      case 'Blog':
        return (
          <Badge className="bg-purple-100 text-purple-700">{category}</Badge>
        );
      case 'News':
      default:
        return (
          <Badge className="bg-emerald-100 text-emerald-700">{category}</Badge>
        );
    }
  };

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100/80 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Rss className="h-4 w-4 mr-2" />
            Latest Market Intel
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Market News & Insights
          </h2>
          <p className="text-xl text-gray-600/80 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with real-time news, expert analysis, and market forecasts from trusted industry sources.
          </p>
        </div>

        {/* --- ⭐ ARTICLES GRID (NOW SHOWS 9 SKELETONS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show 9 skeleton loaders while fetching data
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            // Render the fetched articles
            articles.map((article) => (
              <a
                key={article.id}
                href={article.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <Card className="flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-white/60 backdrop-blur-sm relative overflow-hidden shadow-lg">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      {getCategoryBadge(article.category)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-gray-600/90 leading-relaxed mb-4 line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500/90">
                      <span className="font-medium flex items-center">
                        <Newspaper className="h-4 w-4 mr-1.5 opacity-70" />
                        {article.sourceName}
                      </span>
                      <span className="opacity-80">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Card>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsAndBlogs;