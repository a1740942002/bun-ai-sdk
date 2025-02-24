import { streamText, tool } from 'ai'
import { Agent, type AgentConfig } from './types/agent'
import { z } from 'zod'
import { createPublicClient, formatUnits, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { openai } from '@ai-sdk/openai'

class BalanceAgent extends Agent {
  constructor(config: AgentConfig) {
    super(config)
  }
}

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

const balanceAgent = new BalanceAgent({
  name: 'Balance Agent',
  systemPrompt:
    'You are a helpful assistant that can help with EVM related questions.',
  capabilities: 'You can help with EVM related questions.',
  tools: {
    balance: tool({
      description: 'Get the balance (wei) of an address',
      parameters: z.object({
        address: z
          .string()
          .describe(
            'The address to get the balance of, must start with 0x and be a valid EVM address.'
          )
      }),
      execute: async ({ address }) => {
        const balance = await client.getBalance({
          address: address as `0x${string}`
        })

        return {
          address,
          balance: balance.toString()
        }
      }
    }),
    convertWeiToEther: tool({
      description: 'Convert wei to ether',
      parameters: z.object({
        decimals: z.number().describe('The number of decimals to convert to'),
        wei: z.string().describe('The amount in wei')
      }),
      execute: async ({ wei, decimals }) => {
        const ether = formatUnits(BigInt(wei), decimals)
        return {
          ether
        }
      }
    })
  },
  maxSteps: 3
})

async function main() {
  const address = process.argv[2]

  if (!address || !isAddress(address)) {
    console.error('Please provide a valid EVM address.')
    process.exit(1)
  }

  const result = await streamText({
    model: openai('gpt-4o'),
    prompt: `What is the balance of ${address}?`,
    tools: balanceAgent.config.tools,
    maxSteps: balanceAgent.config.maxSteps
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

main()
