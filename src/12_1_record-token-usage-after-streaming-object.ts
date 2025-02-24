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
  onFinish({ usage }) {
    console.log('Token usage:', usage)
  }
})
