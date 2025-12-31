export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 🔒 Worker injects INTERNAL key
    const response = await fetch(env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.INTERNAL_API_KEY
      },
      body: await request.formData()
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
