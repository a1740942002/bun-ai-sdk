// https://sdk.vercel.ai/cookbook/node/generate-text-with-image-prompt

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await generateText({
  model: openai('gpt-4o'),
  maxTokens: 512,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'what are the red thing in this image?'
        },
        {
          type: 'image',
          image: new URL(
            'https://i.ebayimg.com/images/g/4roAAOSwVNhnPmAj/s-l1600.webp'
          )
        }
      ]
    }
  ]
})

console.log('--------------------------------')
console.log(result.text)
console.log('--------------------------------')
