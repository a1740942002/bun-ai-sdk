// https://sdk.vercel.ai/cookbook/node/embed-text-batch

import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
import 'dotenv/config'

async function main() {
  const { embeddings, usage } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: [
      'sunny day at the beach',
      'rainy afternoon in the city',
      'snowy night in the mountains'
    ]
  })

  console.log('--------------------------------')
  console.log(embeddings)
  console.log(usage)
  console.log('--------------------------------')
}

main().catch(console.error)
