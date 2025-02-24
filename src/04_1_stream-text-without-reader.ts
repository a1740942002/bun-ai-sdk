// https://sdk.vercel.ai/cookbook/node/stream-text

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = streamText({
  model: openai('gpt-3.5-turbo'),
  maxTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.'
})

for await (const textPart of result.textStream) {
  // console.log(textPart)
  process.stdout.write(textPart)
}
