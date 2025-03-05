export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = `https://track.customer.io${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  
  // Ensure the correct host is set
  headers.set("Host", "track.customer.io");

  // Explicitly set headers to preserve them
  headers.set("User-Agent", request.headers.get("User-Agent") || "Mozilla/5.0");
  headers.set("Accept", request.headers.get("Accept") || "*/*");
  headers.set("Referer", request.headers.get("Referer") || "");
  headers.set("Cookie", request.headers.get("Cookie") || "");
  headers.set("Authorization", request.headers.get("Authorization") || "");
  headers.set("Accept-Encoding", request.headers.get("Accept-Encoding") || "gzip, deflate, br");
  headers.set("Accept-Language", request.headers.get("Accept-Language") || "en-US,en;q=0.9");

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    });

    // Convert response headers to a modifiable object
    const responseHeaders = new Headers(response.headers);

    // Set cache headers
    responseHeaders.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
};