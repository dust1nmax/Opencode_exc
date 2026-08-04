import type { Message } from "./type"

export async function loadConfig() {
    const config = await Bun.file("opencode.json").json()
    const [providerID, modelID] = config.model.split("/")
    const provider = config.provider[providerID]
    return { BaseURL: provider.BaseURL}

    
}