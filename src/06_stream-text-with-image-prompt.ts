// https://sdk.vercel.ai/cookbook/node/stream-text-with-image-prompt

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import 'dotenv/config'

async function main() {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    maxTokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'what are the red things in this image?'
          },
          {
            type: 'image',
            image: new URL(
              'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2024_Solar_Eclipse_Prominences.jpg/720px-2024_Solar_Eclipse_Prominences.jpg'
            )
          }
        ]
      }
    ]
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

main().catch(console.error)
