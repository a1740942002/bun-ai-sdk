// https://sdk.vercel.ai/cookbook/node/generate-text

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Why is the sky blue?'
})

console.log('--------------------------------')
console.log(result.text)
console.log('--------------------------------')
