// https://sdk.vercel.ai/cookbook/node/stream-text

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = streamText({
  model: openai('gpt-4o'),
  maxTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.'
})

const reader = result.textStream.getReader()
console.log('--------------------------------')

while (true) {
  const { done, value } = await reader.read()
  if (done) {
    break
  }
  process.stdout.write(value)
}

console.log('\n--------------------------------')
