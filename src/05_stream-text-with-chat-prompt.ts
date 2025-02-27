// https://sdk.vercel.ai/cookbook/node/stream-text-with-chat-prompt

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = streamText({
  model: openai('gpt-3.5-turbo'),
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

for await (const textPart of result.textStream) {
  // console.log(textPart)
  process.stdout.write(textPart)
}
console.log('\n--------------------------------')
