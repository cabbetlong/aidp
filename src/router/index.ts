import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    redirect: '/',
    meta: { guest: true },
  },
  {
    path: '/',
    name: 'LoginRoot',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/chat',
    component: () => import('@/layouts/ChatLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Chat',
        component: () => import('@/views/chat/ChatView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('@/views/admin/KnowledgeBaseView.vue'),
      },
      {
        path: 'intelligent-qa',
        name: 'IntelligentQA',
        component: () => import('@/views/admin/IntelligentQAView.vue'),
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagementView.vue'),
      },
      {
        path: 'models',
        name: 'ModelConfiguration',
        component: () => import('@/views/admin/ModelConfigurationView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from) => {
  const authStore = useAuthStore()

  if ((to.meta.guest || to.path === '/') && authStore.isAuthenticated) {
    return '/chat'
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'LoginRoot', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const requiredRoles = to.meta.roles as string[]
    if (!authStore.hasAnyRole(requiredRoles)) {
      return { name: 'Chat' }
    }
  }

  return true
})

export default router