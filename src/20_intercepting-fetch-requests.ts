import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  // example fetch wrapper that logs the input to the API call:
  fetch: async (url, options) => {
    console.log('URL', url)
    console.log('Headers', JSON.stringify(options!.headers, null, 2))
    console.log(
      `Body ${JSON.stringify(JSON.parse(options!.body! as string), null, 2)}`
    )
    return await fetch(url, options)
  }
})

const { text } = await generateText({
  model: openai('gpt-3.5-turbo'),
  prompt: 'Why is the sky blue?'
})
