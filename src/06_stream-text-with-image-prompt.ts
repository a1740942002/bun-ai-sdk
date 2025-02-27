// https://sdk.vercel.ai/cookbook/node/stream-text-with-image-prompt

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import 'dotenv/config'

async function main() {
  const result = await streamText({
    model: openai('gpt-4o'),
    maxTokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'what are the red thing in this image?'
          },
          {
            type: 'image',
            image: new URL(
              'https://i.ebayimg.com/images/g/4roAAOSwVNhnPmAj/s-l1600.webp'
            )
          }
        ]
      }
    ]
  })

  console.log('--------------------------------')

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }

  console.log('\n--------------------------------')
}

main().catch(console.error)
