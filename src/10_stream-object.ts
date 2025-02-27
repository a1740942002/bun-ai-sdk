// https://sdk.vercel.ai/cookbook/node/stream-object

import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'

const { partialObjectStream } = streamObject({
  model: openai('gpt-4o'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string())
    })
  }),
  prompt: 'Generate a lasagna recipe.'
})

console.log('--------------------------------')

for await (const partialObject of partialObjectStream) {
  console.clear()
  console.log(partialObject)
}

console.log('\n--------------------------------')
