import { type LanguageModelV1, type Tool } from 'ai'

export type AgentConfig = {
  name: string
  systemPrompt: string
  tools: Record<string, Tool>
  model: LanguageModelV1
  maxSteps?: number
}

export abstract class Agent {
  constructor(readonly config: AgentConfig) {}
}
