export interface Message {
    role: "system" |"user"| "assistant"
    content: string
}

export interface ProviderConfig {
    name: string
    baseURL: string
    apiKey: string
    models: Record<string, object>
}

export interface Config {
  model: string
  provider: Record<string, ProviderConfig>
}