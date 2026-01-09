export async function triggerN8NWebhook(url: string, roastId: string): Promise<void> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    throw new Error('N8N_WEBHOOK_URL is not set');
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        roastId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error triggering N8N webhook:', error);
    throw error;
  }
}
