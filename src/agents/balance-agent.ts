import { tool } from 'ai'
import { Agent, type AgentConfig } from '../types/agent'
import { z } from 'zod'
import { createPublicClient, formatUnits, http } from 'viem'
import { mainnet } from 'viem/chains'
import { openai } from '@ai-sdk/openai'

export class BalanceAgent extends Agent {
  constructor(config: AgentConfig) {
    super(config)
  }
}

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

export const balanceAgent = new BalanceAgent({
  model: openai('gpt-4o'),
  name: 'Balance Agent',
  systemPrompt:
    'You are a helpful assistant that can help with getting the balance of an address.',
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
        const balanceInWei = await client.getBalance({
          address: address as `0x${string}`
        })

        return {
          address,
          balanceInWei: balanceInWei.toString(),
          decimals: mainnet.nativeCurrency.decimals
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
          ether,
          wei
        }
      }
    })
  },
  maxSteps: 4
})
