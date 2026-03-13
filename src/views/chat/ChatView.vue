<template>
  <div class="chat-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="app-logo">
          <el-icon class="logo-icon"><Headset /></el-icon>
          <span v-show="!sidebarCollapsed" class="app-name">豆包</span>
        </div>
        <nav v-show="!sidebarCollapsed" class="quick-nav">
          <el-button
            class="nav-button active"
            :icon="ChatDotRound"
            @click="handleNewChat"
          >
            {{ t('layout.newChat') }}
          </el-button>
          <el-button class="nav-button" :icon="EditPen">
            {{ t('layout.aiCreation') }}
          </el-button>
          <el-button class="nav-button" :icon="Cloudy">
            {{ t('layout.cloudStorage') }}
          </el-button>
          <el-button class="nav-button" :icon="MoreFilled">
            {{ t('layout.more') }}
          </el-button>
        </nav>
        <el-button
          v-show="sidebarCollapsed"
          class="collapsed-chat-btn"
          :icon="ChatDotRound"
          circle
          size="large"
          @click="handleNewChat"
        />
      </div>

      <div v-show="!sidebarCollapsed" class="sidebar-content">
        <h3 class="history-title">{{ t('layout.history') }}</h3>
        <ul class="history-list">
          <li
            v-for="session in chatStore.sessions"
            :key="session.id"
            class="history-item"
            :class="{ active: chatStore.currentSessionId === session.id }"
            @click="chatStore.switchSession(session.id)"
          >
            <el-icon class="history-icon"><Document /></el-icon>
            <span class="history-text">{{ session.title }}</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <el-button
          :icon="sidebarCollapsed ? Expand : Fold"
          circle
          class="collapse-button"
          @click="toggleSidebar"
        />
        <template v-if="!sidebarCollapsed">
          <el-button circle :icon="Setting" class="icon-button" />
          <el-dropdown trigger="click">
            <el-button circle :icon="User" class="icon-button" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  {{ authStore.user?.username || 'User' }}
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  {{ t('auth.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <div class="header-left">
          <el-button circle :icon="Edit" class="icon-button" />
          <el-button circle :icon="Delete" class="icon-button" />
        </div>
        <div class="header-center">
          <span class="session-title">{{
            chatStore.currentSession?.title || 'New Chat'
          }}</span>
        </div>
        <div class="header-right">
          <el-button circle :icon="Management" class="icon-button" @click="router.push('/admin/dashboard')" />
          <el-button circle :icon="Share" class="icon-button" />
          <el-button circle :icon="MoreFilled" class="icon-button" />
        </div>
      </header>

      <div class="messages-container">
        <div v-if="chatStore.currentMessages.length === 0" class="empty-state">
          <el-icon class="empty-icon"><ChatLineRound /></el-icon>
          <p class="empty-text">开始新的对话</p>
        </div>

        <div v-else class="messages-wrapper">
          <div
            v-for="message in chatStore.currentMessages"
            :key="message.id"
            class="message-row"
            :class="message.role"
          >
            <div class="message-avatar">
              <el-icon v-if="message.role === 'assistant'" class="assistant-avatar">
                <Headset />
              </el-icon>
              <el-icon v-else class="user-avatar"><User /></el-icon>
            </div>
            <div class="message-bubble" :class="message.role">
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>

          <div v-if="chatStore.isSending" class="message-row assistant">
            <div class="message-avatar">
              <el-icon class="assistant-avatar"><Headset /></el-icon>
            </div>
            <div class="message-bubble assistant">
              <el-icon class="loading-icon"><Loading /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <div class="input-box">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :placeholder="t('layout.placeholder')"
              :autosize="{ minRows: 1, maxRows: 6 }"
              resize="none"
              class="message-input"
              @keydown.enter.prevent="handleSendMessage"
            />
            <div class="input-toolbar">
              <div class="toolbar-left">
                <el-tooltip content="添加附件" placement="top">
                  <el-button circle :icon="Plus" class="toolbar-button" />
                </el-tooltip>
                <el-tooltip content="上传文件" placement="top">
                  <el-button circle :icon="Paperclip" class="toolbar-button" />
                </el-tooltip>
                <el-tooltip content="语音输入" placement="top">
                  <el-button circle :icon="Microphone" class="toolbar-button" />
                </el-tooltip>
              </div>
              <div class="toolbar-right">
                <el-button
                  type="primary"
                  :icon="Promotion"
                  class="send-button"
                  :disabled="!inputMessage.trim()"
                  @click="handleSendMessage"
                >
                  发送
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Headset,
  ChatDotRound,
  EditPen,
  Cloudy,
  MoreFilled,
  Document,
  Setting,
  User as UserIcon,
  Edit,
  Delete,
  Share,
  ChatLineRound,
  Loading,
  Plus,
  Paperclip,
  Microphone,
  Promotion,
  Management,
  Fold,
  Expand,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const inputMessage = ref('')
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function handleNewChat() {
  chatStore.createSession()
  inputMessage.value = ''
}

async function handleSendMessage() {
  if (!inputMessage.value.trim()) return

  const message = inputMessage.value
  inputMessage.value = ''

  await chatStore.sendMessage(message)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100%;
  background: #f5f7fa;
}

.sidebar {
  width: 15rem;
  background: #fff;
  border-right: 1px solid #dde1e6;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 4rem;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dde1e6;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: #1677ff;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-name {
  font-weight: 500;
  color: #1d2129;
}

.quick-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-button {
  width: 100%;
  justify-content: flex-start;
  border: none;
  background: transparent;
  color: #4e5969;
}

.nav-button.active {
  background: #e8f3ff;
  color: #1677ff;
}

.nav-button:hover:not(.active) {
  background: #f5f7fa;
}

.collapsed-chat-btn {
  width: 100%;
  background: transparent;
  color: #4e5969;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.history-title {
  font-size: 0.75rem;
  color: #4e5969;
  padding: 0.5rem 0.75rem;
  margin: 0;
  font-weight: 500;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-item.active {
  background: #f5f7fa;
}

.history-icon {
  color: #4e5969;
}

.history-text {
  font-size: 0.875rem;
  color: #1d2129;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #dde1e6;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}

.collapse-button {
  border: none;
  background: transparent;
  color: #4e5969;
  z-index: 10;
}

.collapse-button:hover {
  background: #f5f7fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.main-header {
  height: 3rem;
  background: #fff;
  border-bottom: 1px solid #dde1e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.header-left,
.header-right {
  display: flex;
  gap: 0.5rem;
}

.header-center {
  flex: 1;
  text-align: center;
}

.session-title {
  font-size: 0.875rem;
  color: #4e5969;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4e5969;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #dde1e6;
}

.empty-text {
  font-size: 1rem;
}

.messages-wrapper {
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-row {
  display: flex;
  gap: 0.75rem;
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.assistant-avatar {
  background: #1677ff;
  color: #fff;
}

.user-avatar {
  background: #e5e7eb;
  color: #fff;
}

.message-bubble {
  max-width: 80%;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-bubble.assistant {
  background: #fff;
  border: 1px solid #dde1e6;
}

.message-bubble.user {
  background: #1677ff;
  color: #fff;
}

.message-content {
  line-height: 1.6;
  word-wrap: break-word;
}

.loading-icon {
  font-size: 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.input-container {
  border-top: 1px solid #dde1e6;
  background: #fff;
  padding: 1rem;
}

.input-wrapper {
  max-width: 48rem;
  margin: 0 auto;
}

.input-box {
  border: 1px solid #dde1e6;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-box:hover {
  border-color: #c9cdd4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.message-input :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  min-height: 3.5rem;
  box-shadow: none;
  resize: none;
}

.message-input :deep(.el-textarea__inner):focus {
  border: none;
  box-shadow: none;
}

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.toolbar-left {
  display: flex;
  gap: 0.25rem;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.toolbar-button {
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: #4e5969;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #f5f7fa;
  color: #1677ff;
}

.send-button {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
}

.icon-button {
  border: none;
  background: transparent;
  color: #4e5969;
}

.icon-button:hover {
  background: #f5f7fa;
}
</style>