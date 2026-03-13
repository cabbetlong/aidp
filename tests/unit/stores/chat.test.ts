import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '@/stores/chat'

describe('Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('initial state should be correct', () => {
    const chatStore = useChatStore()
    expect(chatStore.sessions).toEqual([])
    expect(chatStore.currentSessionId).toBeNull()
    expect(chatStore.isSending).toBe(false)
  })

  it('should create a new session', () => {
    const chatStore = useChatStore()
    const sessionId = chatStore.createSession()

    expect(chatStore.sessions).toHaveLength(1)
    expect(chatStore.currentSessionId).toBe(sessionId)
    expect(chatStore.sessions[0].title).toBe('New Chat')
    expect(chatStore.sessions[0].messages).toEqual([])
  })

  it('should create a session with custom title', () => {
    const chatStore = useChatStore()
    chatStore.createSession('Custom Title')

    expect(chatStore.sessions[0].title).toBe('Custom Title')
  })

  it('should add message to current session', () => {
    const chatStore = useChatStore()
    chatStore.createSession()
    
    chatStore.addMessage({ role: 'user', content: 'Hello' })

    expect(chatStore.currentMessages).toHaveLength(1)
    expect(chatStore.currentMessages[0].role).toBe('user')
    expect(chatStore.currentMessages[0].content).toBe('Hello')
  })

  it('should update session title on first user message', () => {
    const chatStore = useChatStore()
    chatStore.createSession()
    
    chatStore.addMessage({ role: 'user', content: 'This is a very long message that should be truncated' })

    expect(chatStore.sessions[0].title).toBe('This is a very long message th...')
  })

  it('should create session automatically when adding message without active session', () => {
    const chatStore = useChatStore()
    
    chatStore.addMessage({ role: 'user', content: 'Hello' })

    expect(chatStore.sessions).toHaveLength(1)
    expect(chatStore.currentSessionId).not.toBeNull()
    expect(chatStore.currentMessages).toHaveLength(1)
  })

  it('should send message and receive AI response', async () => {
    const chatStore = useChatStore()
    chatStore.createSession()

    const promise = chatStore.sendMessage('你好')

    expect(chatStore.isSending).toBe(true)
    vi.advanceTimersByTime(1000)

    await promise

    expect(chatStore.isSending).toBe(false)
    expect(chatStore.currentMessages).toHaveLength(2)
    expect(chatStore.currentMessages[0].role).toBe('user')
    expect(chatStore.currentMessages[1].role).toBe('assistant')
  })

  it('should handle multiple sessions', () => {
    const chatStore = useChatStore()
    
    const session1Id = chatStore.createSession('Session 1')
    chatStore.addMessage({ role: 'user', content: 'Message 1' })

    const session2Id = chatStore.createSession('Session 2')
    chatStore.addMessage({ role: 'user', content: 'Message 2' })

    expect(chatStore.sessions).toHaveLength(2)
    expect(chatStore.currentSessionId).toBe(session2Id)
    expect(chatStore.currentMessages[0].content).toBe('Message 2')

    chatStore.switchSession(session1Id)
    expect(chatStore.currentSessionId).toBe(session1Id)
    expect(chatStore.currentMessages[0].content).toBe('Message 1')
  })

  it('should delete session', () => {
    const chatStore = useChatStore()
    
    const session1Id = chatStore.createSession('Session 1')
    const session2Id = chatStore.createSession('Session 2')

    expect(chatStore.sessions).toHaveLength(2)

    chatStore.deleteSession(session1Id)

    expect(chatStore.sessions).toHaveLength(1)
    expect(chatStore.sessions[0].id).toBe(session2Id)
  })

  it('should clear current session messages', () => {
    const chatStore = useChatStore()
    chatStore.createSession()
    
    chatStore.addMessage({ role: 'user', content: 'Message 1' })
    chatStore.addMessage({ role: 'assistant', content: 'Response 1' })

    expect(chatStore.currentMessages).toHaveLength(2)

    chatStore.clearCurrentSession()

    expect(chatStore.currentMessages).toHaveLength(0)
  })

  it('should switch to another session when deleting current session', () => {
    const chatStore = useChatStore()
    
    const session1Id = chatStore.createSession('Session 1')
    const session2Id = chatStore.createSession('Session 2')

    chatStore.switchSession(session1Id)
    chatStore.deleteSession(session1Id)

    expect(chatStore.currentSessionId).toBe(session2Id)
  })

  it('should set currentSessionId to null when deleting last session', () => {
    const chatStore = useChatStore()
    
    const sessionId = chatStore.createSession()
    chatStore.deleteSession(sessionId)

    expect(chatStore.currentSessionId).toBeNull()
  })
})