export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 🔐 Forward request to n8n (SECRET)
  const N8N_WEBHOOK = env.N8N_WEBHOOK_URL;
  const N8N_API_KEY = env.N8N_API_KEY;

  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "x-api-key": N8N_API_KEY
      },
      body: await request.formData()
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error. Please try again."
      }),
      { status: 500 }
    );
  }
}
