// https://sdk.vercel.ai/cookbook/node/stream-text-with-file-prompt

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

async function main() {
  const result = streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is XY Finance?'
          },
          {
            type: 'file',
            data: fs.readFileSync(
              path.join(__dirname, '../assets/xy-finance-overview.pdf')
            ),
            mimeType: 'application/pdf'
          }
        ]
      }
    ]
  })

  console.log('--------------------------------')

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }

  console.log('\n--------------------------------')
}

main().catch(console.error)
