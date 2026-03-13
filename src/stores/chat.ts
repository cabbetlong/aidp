import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Message, ChatSession } from '@/types'

let sessionIdCounter = 0

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isSending = ref(false)

  const currentSession = computed(() =>
    sessions.value.find((s) => s.id === currentSessionId.value)
  )

  const currentMessages = computed(() => currentSession.value?.messages || [])

  function createSession(title = 'New Chat'): string {
    sessionIdCounter++
    const id = `session-${sessionIdCounter}`
    const newSession: ChatSession = {
      id,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    sessions.value.push(newSession)
    currentSessionId.value = id
    return id
  }

  function deleteSession(sessionId: string): void {
    const index = sessions.value.findIndex((s) => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value[0]?.id || null
      }
    }
  }

  function switchSession(sessionId: string): void {
    currentSessionId.value = sessionId
  }

  function addMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
    if (!currentSessionId.value) {
      createSession()
    }

    const session = sessions.value.find((s) => s.id === currentSessionId.value)
    if (session) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      session.messages.push(newMessage)
      session.updatedAt = Date.now()
      
      if (message.role === 'user' && session.messages.length === 1) {
        session.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
      }
    }
  }

  async function sendMessage(content: string): Promise<void> {
    addMessage({ role: 'user', content })
    isSending.value = true

    try {
      const response = await mockAIApi(content)
      addMessage({ role: 'assistant', content: response })
    } catch (error) {
      console.error('Failed to send message:', error)
      addMessage({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' })
    } finally {
      isSending.value = false
    }
  }

  function clearCurrentSession(): void {
    const session = sessions.value.find((s) => s.id === currentSessionId.value)
    if (session) {
      session.messages = []
      session.updatedAt = Date.now()
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    isSending,
    createSession,
    addMessage,
    deleteSession,
    switchSession,
    sendMessage,
    clearCurrentSession,
  }
})

async function mockAIApi(query: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  const responses: Record<string, string> = {
    '你好': '你好！很高兴为你服务。有什么我可以帮助你的吗？',
    'GLM-4.7': 'GLM-4.7是智谱AI推出的多模态大语言模型，具备强大的文本理解、代码生成和多模态能力。',
    '默认': '这是一个模拟的AI回复。在实际应用中，这里会调用真实的AI API接口。',
  }
  
  return responses[query] || responses['默认']
}