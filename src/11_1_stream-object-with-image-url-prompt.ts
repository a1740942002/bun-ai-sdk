// https://sdk.vercel.ai/cookbook/node/stream-object-with-image-prompt

import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import 'dotenv/config'

async function main() {
  const { partialObjectStream } = streamObject({
    model: openai('gpt-4o'),
    maxTokens: 512,
    schema: z.object({
      stamps: z.array(
        z.object({
          country: z.string(),
          date: z.string()
        })
      )
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'list all the stamps in these passport pages?'
          },
          {
            type: 'image',
            image: new URL(
              'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/WW2_Spanish_official_passport.jpg/1498px-WW2_Spanish_official_passport.jpg'
            )
          }
        ]
      }
    ]
  })

  for await (const partialObject of partialObjectStream) {
    console.clear()
    console.log(partialObject)
  }
}

main()
