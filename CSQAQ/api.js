const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 设置CORS头，允许Google Apps Script调用
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { marketHashNameList, apiToken } = req.body;
    
    // 验证必要参数
    if (!marketHashNameList || !apiToken) {
      return res.status(400).json({ 
        error: 'Missing required parameters: marketHashNameList and apiToken are required' 
      });
    }
    
    console.log('Proxying request for items:', marketHashNameList.length);
    
    // 调用csqaq API
    const response = await fetch('https://api.csqaq.com/api/v1/goods/getPriceByMarketHashName', {
      method: 'POST',
      headers: {
        'ApiToken': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ marketHashNameList })
    });
    
    const data = await response.json();
    
    // 记录成功日志
    console.log('CSQAQ API response code:', data.code);
    if (data.data && data.data.success) {
      console.log('Successfully fetched', Object.keys(data.data.success).length, 'items');
    }
    
    // 返回数据给Google Apps Script
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy service error: ' + error.message 
    });
  }
};