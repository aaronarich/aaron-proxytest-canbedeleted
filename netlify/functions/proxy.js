export async function handler(event) {
    const { path, queryStringParameters, headers, httpMethod, body } = event;
  
    const targetUrl = `https://track.customer.io${path}${
      queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''
    }`;
  
    try {
      const response = await fetch(targetUrl, {
        method: httpMethod,
        headers: {
          ...headers,
          host: 'netlify-proxy.aarich.dev', // Ensure correct Host header
        },
        body: httpMethod !== 'GET' && httpMethod !== 'HEAD' ? body : undefined,
      });
  
      const responseBody = await response.text();
      const responseHeaders = Object.fromEntries(response.headers.entries());
  
      return {
        statusCode: response.status,
        headers: responseHeaders,
        body: responseBody,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Proxy error: ${error.message}`,
      };
    }
  }