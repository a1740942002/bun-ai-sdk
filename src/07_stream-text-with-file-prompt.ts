// https://sdk.vercel.ai/cookbook/node/stream-text-with-file-prompt

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import 'dotenv/config'
import fs from 'node:fs'

async function main() {
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is an embedding model according to this document?'
          },
          {
            type: 'file',
            data: fs.readFileSync('./data/ai.pdf'),
            mimeType: 'application/pdf'
          }
        ]
      }
    ]
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

main().catch(console.error)
