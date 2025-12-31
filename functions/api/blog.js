export async function onRequest(context) {
  const { request, env } = context;

  // 🔒 Allow only POST
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🔒 Validate Content-Type
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid Content Type" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🔒 Validate incoming API key (Browser → Worker)
  const incomingKey = request.headers.get("x-api-key");
  if (!incomingKey || incomingKey !== env.PUBLIC_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 🔒 Forward request to n8n with INTERNAL key
    const response = await fetch(env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.INTERNAL_API_KEY
      },
      body: await request.formData()
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error. Please try again."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
