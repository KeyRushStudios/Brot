import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('BrotSMP Bot läuft 24/7 über Cloudflare!', { status: 200 });
    }

    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const isValidRequest = verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
      return new Response('Ungültige Signatur', { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === InteractionType.PING) {
      return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      if (interaction.data.name === 'ip') {
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content:
                '🍞 **BrotSMP Server-IPs** 🍞\n\n' +
                '💻 **Java Edition:** `brotsmp1.minekeep.gg`\n' +
                '📱 **Bedrock Edition:** `brotsmp1.bedrock.minekeep.gg`',
            },
          }),
          { headers: { 'content-type': 'application/json' } }
        );
      }
    }

    return new Response('Befehl nicht gefunden', { status: 400 });
  },
};
