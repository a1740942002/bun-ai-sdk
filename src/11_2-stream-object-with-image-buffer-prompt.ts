// https://sdk.vercel.ai/cookbook/node/stream-object-with-image-prompt

import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import 'dotenv/config'
import { z } from 'zod'
import fs from 'node:fs'

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
            image: fs.readFileSync(`${__dirname}/../assets/stamps.png`)
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
