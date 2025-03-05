export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = `https://track.customer.io${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  
  // Explicitly set headers to match what AWS might be preserving
  headers.set("Host", "track.customer.io"); // Ensures the destination server processes the request correctly
  headers.set("User-Agent", request.headers.get("User-Agent") || "Mozilla/5.0");
  headers.set("Accept", request.headers.get("Accept") || "*/*");
  headers.set("Referer", request.headers.get("Referer") || "");
  headers.set("Cookie", request.headers.get("Cookie") || ""); // If cookies are required for authentication
  headers.set("Authorization", request.headers.get("Authorization") || ""); // If auth headers are used
  headers.set("Accept-Encoding", request.headers.get("Accept-Encoding") || "gzip, deflate, br");
  headers.set("Accept-Language", request.headers.get("Accept-Language") || "en-US,en;q=0.9");

  // Debugging: Log the headers before forwarding the request
  console.log("Forwarding request to:", targetUrl);
  console.log("Forwarded Headers:", Object.fromEntries(headers.entries()));

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
};