/**
 * @reference
 * Vercel AI SDK: https://sdk.vercel.ai/cookbook/node/retrieval-augmented-generation
 * LangChain: https://python.langchain.com/docs/tutorials/rag/
 * Google Cloud: https://cloud.google.com/use-cases/retrieval-augmented-generation?hl=zh_tw
 */

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { openai } from '@ai-sdk/openai'
import { cosineSimilarity, embed, embedMany, streamText } from 'ai'

dotenv.config()

async function main() {
  const input = process.argv[2]
  if (!input) {
    console.error('Please provide a valid question.')
    process.exit(1)
  }

  const db: { embedding: number[]; value: string }[] = []

  const essay = fs.readFileSync(
    path.join(__dirname, '../assets/xy-finance.txt'),
    'utf8'
  )
  const chunks = essay
    .split('.')
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0 && chunk !== '\n')

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunks
  })
  embeddings.forEach((e, i) => {
    db.push({
      embedding: e,
      value: chunks[i]
    })
  })

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: input
  })

  const context = db
    .map((item) => ({
      document: item,
      similarity: cosineSimilarity(embedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map((r) => r.document.value)
    .join('\n')

  const result = await streamText({
    model: openai('gpt-4o'),
    prompt: `Answer the following question based only on the provided context:
             ${context}

             Question: ${input}`
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

main().catch(console.error)
