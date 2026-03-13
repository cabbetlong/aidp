<template>
  <el-container class="admin-layout">
    <el-aside width="240px" class="admin-sidebar">
      <div class="sidebar-logo">
        <el-icon><Platform /></el-icon>
        <span>AIDP Admin</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>{{ t('admin.dashboard') }}</span>
        </el-menu-item>
        <el-menu-item index="/admin/knowledge-base">
          <el-icon><Document /></el-icon>
          <span>{{ t('admin.knowledgeBase') }}</span>
        </el-menu-item>
        <el-menu-item index="/admin/intelligent-qa">
          <el-icon><ChatLineRound /></el-icon>
          <span>{{ t('admin.intelligentQA') }}</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>{{ t('admin.userManagement') }}</span>
        </el-menu-item>
        <el-menu-item index="/admin/models">
          <el-icon><Setting /></el-icon>
          <span>{{ t('admin.modelConfiguration') }}</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32">{{ authStore.user?.username?.[0]?.toUpperCase() }}</el-avatar>
            <span class="username">{{ authStore.user?.username }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <span>{{ authStore.user?.email }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                {{ t('auth.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-button circle :icon="Fold" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/">{{ t('common.welcome') }}</el-breadcrumb-item>
            <el-breadcrumb-item :to="currentPath">{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-button circle :icon="Bell" />
          <el-dropdown>
            <el-button circle>
              <el-icon><User /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="locale in locales"
                  :key="locale.code"
                  :class="{ active: currentLocale === locale.code }"
                  @click="changeLocale(locale.code)"
                >
                  {{ locale.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  Platform,
  DataBoard,
  Document,
  ChatLineRound,
  User,
  Setting,
  Fold,
  Bell,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const currentLocale = ref(locale.value)

const locales = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en', name: 'English' },
]

const activeMenu = computed(() => route.path)
const currentPath = computed(() => route.path)

const pageTitleMap: Record<string, string> = {
  '/admin/dashboard': 'admin.dashboard',
  '/admin/knowledge-base': 'admin.knowledgeBase',
  '/admin/intelligent-qa': 'admin.intelligentQA',
  '/admin/users': 'admin.userManagement',
  '/admin/models': 'admin.modelConfiguration',
}

const currentPageTitle = computed(() => {
  const key = pageTitleMap[route.path]
  return key ? t(key) : 'Page'
})

function changeLocale(code: string) {
  currentLocale.value = code
  locale.value = code
  ElMessage.success(`Language switched to ${code}`)
}

function handleCommand(command: string) {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100%;
}

.admin-sidebar {
  background: #001529;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  background: transparent;
}

.sidebar-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #1677ff;
  color: #fff;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.08);
}

.username {
  color: #fff;
  font-size: 0.875rem;
}

.admin-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left :deep(.el-breadcrumb) {
  margin-left: 1rem;
}

.admin-main {
  background: #f0f2f5;
  padding: 1.5rem;
  overflow-y: auto;
}

.el-dropdown-menu :deep(.el-dropdown-menu__item.active) {
  color: #1677ff;
  background: #e6f7ff;
}
</style>