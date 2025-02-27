// https://sdk.vercel.ai/cookbook/node/embed-text

import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import 'dotenv/config'

async function main() {
  const { embedding, usage } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: 'sunny day at the beach'
  })

  console.log('--------------------------------')
  console.log(embedding)
  console.log(usage)
  console.log('--------------------------------')
}

main().catch(console.error)
