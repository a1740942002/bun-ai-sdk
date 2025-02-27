// https://sdk.vercel.ai/cookbook/node/generate-object

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const result = await generateObject({
  model: openai('gpt-4o'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string()
        })
      ),
      steps: z.array(z.string())
    })
  }),
  prompt: 'Generate a laszagna recipe.'
})

console.log('--------------------------------')
console.log(JSON.stringify(result.object.recipe, null, 2))
console.log('--------------------------------')
