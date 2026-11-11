import { verifyKey } from 'discord-interactions';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      return new Response('BrotSMP Bot läuft erfolgreich auf Cloudflare Workers!');
    }

    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );

    if (!isValidRequest) {
      return new Response('Ungültige Anfrage-Signatur.', { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Discord Ping (Verifizierungstest)
    if (interaction.type === 1) {
      return Response.json({ type: 1 });
    }

    // Slash Commands (Befehle)
    if (interaction.type === 2) {
      const { name } = interaction.data;

      if (name === 'ip') {
        return Response.json({
          type: 4, // Sendet eine sichtbare Antwort im Kanal
          data: {
            content: "🥖 **BrotSMP Server-IPs**\n\n" +
                     "☕ **Java Edition:** `brotsmp1.minekeep.gg`\n" +
                     "📱 **Bedrock Edition:** `brotsmp1.bedrock.minekeep.gg`",
          },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

