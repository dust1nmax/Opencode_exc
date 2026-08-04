export interface Message {
    role: "system" |"user"| "assistant"//只能是三者之一
    content: string
}

//fetch （curl） 要用的数据
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