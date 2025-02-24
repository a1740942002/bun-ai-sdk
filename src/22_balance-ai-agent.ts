import { streamText } from 'ai'
import { isAddress } from 'viem'
import { balanceAgent } from './agents/balance-agent'

// 0xEEc97E8Fd136EcF94eA15a9D511210Ec21CB4008
async function main() {
  const address = process.argv[2]

  if (!address || !isAddress(address)) {
    console.error('Please provide a valid EVM address.')
    process.exit(1)
  }

  const result = await streamText({
    model: balanceAgent.config.model,
    system: balanceAgent.config.systemPrompt,
    tools: balanceAgent.config.tools,
    maxSteps: balanceAgent.config.maxSteps,
    prompt: `What is the balance of ${address}? (ether)`
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

main()
