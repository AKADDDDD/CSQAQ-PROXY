 const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { marketHashNameList, apiToken } = req.body;
    
    if (!marketHashNameList || !apiToken) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }
    
    console.log('Proxying request for items:', marketHashNameList);
    
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
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
};
