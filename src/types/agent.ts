import { type Tool } from 'ai'

export type AgentConfig = {
  name: string
  systemPrompt: string
  capabilities: string
  tools: Record<string, Tool>
  maxSteps?: number
}

export abstract class Agent {
  constructor(readonly config: AgentConfig) {}
}
