// https://sdk.vercel.ai/cookbook/node/generate-text-with-chat-prompt

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await generateText({
  model: openai('gpt-4o'),
  maxTokens: 1024,
  system: 'You are a helpful chatbot.',
  messages: [
    {
      role: 'user',
      content: 'Hello!'
    },
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    },
    {
      role: 'user',
      content: 'I need help with my computer.'
    }
  ]
})

console.log('--------------------------------')
console.log(result.text)
console.log('--------------------------------')
