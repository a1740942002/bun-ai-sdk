// https://sdk.vercel.ai/cookbook/node/stream-object-record-final-object

import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'
import 'dotenv/config'

const result = streamObject({
  model: openai('gpt-4o'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string())
    })
  }),
  prompt: 'Generate a lasagna recipe.',
  onFinish({ object, error }) {
    // handle type validation failure (when the object does not match the schema):
    if (object === undefined) {
      console.error('Error:', error)
      return
    }

    console.log('Final object:', JSON.stringify(object, null, 2))
  }
})
