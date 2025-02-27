// https://sdk.vercel.ai/cookbook/node/generate-object-reasoning

import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import 'dotenv/config'
import { z } from 'zod'

async function main() {
  const { text: rawOutput } = await generateText({
    model: openai('o1'),
    prompt:
      'Predict the top 3 largest city by 2050. For each, return the name, the country, the reason why it will on the list, and the estimated population in millions.'
  })

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    prompt: 'Extract the desired information from this text: \n' + rawOutput,
    schema: z.object({
      name: z.string().describe('the name of the city'),
      country: z.string().describe('the name of the country'),
      reason: z
        .string()
        .describe(
          'the reason why the city will be one of the largest cities by 2050'
        ),
      estimatedPopulation: z.number()
    }),
    output: 'array'
  })

  console.log('--------------------------------')
  console.log(object)
  console.log('--------------------------------')
}

main().catch(console.error)
