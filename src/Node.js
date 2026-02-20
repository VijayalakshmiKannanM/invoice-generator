import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 200,
  messages: [
    { role: "user", content: "Explain this code" }
  ]
});

console.log(response.content[0].text);
