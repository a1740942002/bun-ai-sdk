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

/**
 * 「Retrieval Augmented Generation (RAG)」可以想像成一種「帶資料庫」的生成式模型應用。也就是說，當語言模型在生成答案的時候，如果僅僅依賴它在訓練時期看到的內容，可能無法回答一些較新的或較專門領域的問題。RAG 的做法就是先把一些外部資料（例如檔案、文章、資料庫等）透過向量化（embeddings）的方式儲存在一個可檢索的資料庫裡（例如向量資料庫）。
 * 所以，整體來看，RAG 的確是透過「檢索→抽取最相關內容→融合到 prompt 裡」的方式來增進模型的回答品質。若要用一句話概括：
 * 	RAG 就是先在外部知識庫中找到最相關的內容，然後把它加到模型的 prompt，讓模型在生成時能參考到這些「即時、可靠或更專門」的資訊。
 */
async function main() {
  const db: { embedding: number[]; value: string }[] = []

  /**
   * I have always been fascinated by creating new things. Before entering college, I devoted most of my free time to painting, primarily landscapes and portraits. My passion for art extended to digital design, which I also explored during my high school years. Additionally, I developed a keen interest in wildlife photography after a family vacation to a national park. This newfound hobby taught me patience and attention to detail, as I waited for hours to capture the perfect shot. Upon graduating high school, I decided to pursue a degree in environmental science. During college, I participated in several research projects focusing on sustainable resource management. I also joined the university's photography club, where I learned different techniques and collaborated with peers on various creative projects. Looking back, I believe my artistic background played a crucial role in shaping my perspective on problem-solving and innovation.
   * 我一直對創造新事物感到著迷。在上大學之前，我將大部分的空閒時間投入在繪畫，主要是風景畫和肖像畫。對藝術的熱愛也延伸到數位設計，這是在我高中期間所探索的領域。此外，在一次家庭旅遊造訪國家公園後，我對野生動物攝影產生了濃厚的興趣。這個新愛好讓我學到了耐心與對細節的關注，因為我常常必須等待好幾個小時才能捕捉到完美的照片。高中畢業後，我決定修讀環境科學系。在大學期間，我參與了多項專注於永續資源管理的研究計劃，同時也加入了學校的攝影社，學習多種技巧並與同儕合作完成各式創意專案。回顧過去，我認為我的藝術背景在塑造我對問題解決與創新的思維上，扮演了關鍵的角色。
   */
  const essay = fs.readFileSync(
    path.join(__dirname, '../assets/essay.txt'),
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

  const input =
    'What were the two main things the author worked on before college?'

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: input
  })

  /**
   * Before entering college, I devoted most of my free time to painting, primarily landscapes and portraits
During college, I participated in several research projects focusing on sustainable resource management
My passion for art extended to digital design, which I also explored during my high school years
   */
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
