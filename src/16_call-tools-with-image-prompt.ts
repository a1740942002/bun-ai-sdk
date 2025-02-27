// https://sdk.vercel.ai/cookbook/node/call-tools-with-image-prompt

import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const result = await streamText({
  model: openai('gpt-4o'),
  maxSteps: 2,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'can you log this meal for me?' },
        {
          type: 'image',
          image: new URL(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Cheeseburger_%2817237580619%29.jpg/640px-Cheeseburger_%2817237580619%29.jpg'
          )
        }
      ]
    }
  ],
  tools: {
    logFood: tool({
      description: 'Log a food item',
      parameters: z.object({
        name: z.string(),
        calories: z.number()
      }),
      execute: async ({ name, calories }) => {
        // call an API to fetch food details
        return { name, calories }
      }
    })
  }
})

console.log('--------------------------------')

for await (const textPart of result.textStream) {
  process.stdout.write(textPart)
}

console.log('\n--------------------------------')
