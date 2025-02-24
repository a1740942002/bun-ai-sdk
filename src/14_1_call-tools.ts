// https://sdk.vercel.ai/cookbook/node/call-tools

import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import 'dotenv/config'

const result = await streamText({
  model: openai('gpt-4o'),
  maxSteps: 2,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for')
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10
      })
    })
    // cityAttractions: tool({
    //   parameters: z.object({ city: z.string() })
    // })
  },
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?'
})

for await (const textPart of result.textStream) {
  process.stdout.write(textPart)
}
