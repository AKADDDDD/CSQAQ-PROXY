const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// 允许CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/proxy', async (req, res) => {
  try {
    const { marketHashNameList, apiToken } = req.body;
    
    if (!marketHashNameList || !apiToken) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    
    console.log('代理请求:', marketHashNameList);
    
    const response = await fetch('https://api.csqaq.com/api/v1/goods/getPriceByMarketHashName', {
      method: 'POST',
      headers: {
        'ApiToken': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ marketHashNameList })
    });
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/', (req, res) => {
  res.json({ message: 'CSQAQ Proxy Service Running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
