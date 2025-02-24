// https://sdk.vercel.ai/cookbook/node/call-tools

import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

async function main() {
  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    maxTokens: 512,
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
      }),
      cityAttractions: tool({
        parameters: z.object({ city: z.string() })
      })
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?'
  })

  // typed tool results for tools with execute method:
  for (const toolResult of result.toolResults) {
    switch (toolResult.toolName) {
      case 'weather': {
        toolResult.args.location // string
        toolResult.result.location // string
        toolResult.result.temperature // number
        break
      }
    }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error)
