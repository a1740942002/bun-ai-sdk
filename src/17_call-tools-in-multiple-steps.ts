// https://sdk.vercel.ai/cookbook/node/call-tools-multiple-steps

import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const result = await streamText({
  model: openai('gpt-4-turbo'),
  maxSteps: 5,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for')
      }),
      execute: async ({ location }: { location: string }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10
      })
    })
  },
  prompt: 'What is the weather in San Francisco?'
})

console.log('--------------------------------')

for await (const textPart of result.textStream) {
  process.stdout.write(textPart)
}

console.log('\n--------------------------------')
