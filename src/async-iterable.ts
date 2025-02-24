// 定義一個異步可迭代對象
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    const data = ['Hello', 'World', 'from', 'async', 'iterable']
    for (const item of data) {
      // 模擬一個異步操作，例如從網絡獲取數據
      await new Promise((resolve) => setTimeout(resolve, 1000))
      yield item
    }
  }
}

async function processAsyncIterable() {
  for await (const value of asyncIterable) {
    console.log(value)
  }
}

processAsyncIterable()
