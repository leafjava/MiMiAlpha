/**
 * Cloudflare Worker - API 代理
 * 将 HTTPS 请求转发到 HTTP 后端
 */

const BACKEND_BASE = 'http://47.93.166.48';

const API_ROUTES = {
  '/api/assistant': ':8000/v1/assistant',
  '/api/risk': ':5003/api/risk',
  '/api/dispute': ':5004/api/dispute',
  '/api/governance': ':8006/api/governance',
  '/api/credit': ':8003/api/credit',
  '/api/assets': ':8004/api/assets',
  '/api/yield': ':8005/api/yield',
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
  
  // 查找匹配的路由
  let backendUrl = null;
  for (const [route, backend] of Object.entries(API_ROUTES)) {
    if (url.pathname.startsWith(route)) {
      const path = url.pathname.replace(route, '');
      backendUrl = `${BACKEND_BASE}${backend}${path}${url.search}`;
      break;
    }
  }
  
  if (!backendUrl) {
    return new Response('Not Found', { status: 404 });
  }
  
  // 转发请求到后端
  const backendRequest = new Request(backendUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
  });
  
  try {
    const response = await fetch(backendRequest);
    const newResponse = new Response(response.body, response);
    
    // 添加 CORS 头
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
