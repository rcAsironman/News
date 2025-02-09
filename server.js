const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const API_KEY = 'd0bc767c45604760bb11a49cb4d48768';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// Mock data for when the API is not available
const mockNews = {
  status: "ok",
  articles: [
    {
      source: { id: "mock-1", name: "Tech News" },
      author: "John Doe",
      title: "The Future of AI Technology",
      description: "Exploring the latest developments in artificial intelligence and their impact on society.",
      url: "https://example.com/ai-news",
      urlToImage: "https://via.placeholder.com/400x200?text=AI+Technology",
      publishedAt: new Date().toISOString(),
      content: "Artificial intelligence continues to evolve..."
    },
    {
      source: { id: "mock-2", name: "World News" },
      author: "Jane Smith",
      title: "Global Climate Initiative Launched",
      description: "World leaders announce new measures to combat climate change.",
      url: "https://example.com/climate-news",
      urlToImage: "https://via.placeholder.com/400x200?text=Climate+News",
      publishedAt: new Date().toISOString(),
      content: "In a historic move, world leaders..."
    },
    {
      source: { id: "mock-3", name: "Sports Update" },
      author: "Mike Johnson",
      title: "Major Sports Event Announcement",
      description: "New international sports competition to be launched next year.",
      url: "https://example.com/sports-news",
      urlToImage: "https://via.placeholder.com/400x200?text=Sports+News",
      publishedAt: new Date().toISOString(),
      content: "Sports enthusiasts around the world..."
    }
  ]
};

app.get('/api/news', async (req, res) => {
  try {
    const country = req.query.country || 'us';
    
    try {
      const response = await axios.get(`${BASE_URL}?country=${country}&apiKey=${API_KEY}`, {
        headers: {
          'User-Agent': 'news-app-proxy'
        }
      });
      res.json(response.data);
    } catch (apiError) {
      console.log('Using mock data due to API error:', apiError.message);
      // Return mock data with a slight delay to simulate API call
      setTimeout(() => {
        res.json(mockNews);
      }, 500);
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});