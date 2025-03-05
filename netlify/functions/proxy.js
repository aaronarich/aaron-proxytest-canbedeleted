export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = `https://track.customer.io${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);

  // 🔹 Set the correct Host header so Customer.io validates the request correctly
  headers.set("Host", "track.customer.io");

  // 🔹 Ensure all security-sensitive headers are passed correctly
  headers.set("User-Agent", request.headers.get("User-Agent") || "Mozilla/5.0");
  headers.set("Referer", request.headers.get("Referer") || "");
  headers.set("Cookie", request.headers.get("Cookie") || ""); // If authentication relies on cookies
  headers.set("Authorization", request.headers.get("Authorization") || ""); // If tokens are used
  headers.set("Accept", request.headers.get("Accept") || "*/*");

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